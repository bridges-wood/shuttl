import json

import requests
from bs4 import BeautifulSoup

ignore_words = [
  "spacecraft",
  "space",
  "shuttle",
  "wikipedia",
  "specialist"
]

def findNextMission(soup):
  """
  Finds the next mission in the sequence of all missions.
  """
  # Find div with id P156
  div = soup.find(id="P156")

  if div is None:
    return None

  # Find all links in div with title containing a Q
  link = div.find('a', title=lambda title: title and title.startswith('Q'))
  return "https://www.wikidata.org" + link['href']

def findCrew(soup):
  """
  Finds the crew members of a given mission.
  """
  crew = soup.find(id="P1029")
  # Find all links in div with title containing a Q
  crew_links = crew.findAll('a', title=lambda title: title and title.startswith('Q'))
  # Check if any word in the link text matches an ignored word
  crew_links = [link for link in crew_links if not any(word in link.text.lower() for word in ignore_words)]
  return [link.text for link in crew_links]

def findPatchURL(id):
  """
  Finds the URL of the patch image for a given mission.
  """
  # If id ends in a letter, make the last letter lowercase
  if id[-1].isalpha():
    id = id[:-1] + id[-1].lower()
  
  return f"https://history.nasa.gov/patches/shuttle/{id}.jpg"


def formatDate(text):
  """
  Formats a date string from the wikidata page into a format that can be used by the frontend.
  """
  # Take natural language date and return a date string
  tokens = text.split(' ')
  months = {
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12'
  }
  return f"{tokens[2]}-{months[tokens[1]]}-{tokens[0]}"
  
def generateMissionData(soup):
  """
  Generates a dictionary of mission data from the wikidata page.
  """
  mission = {}
  # Set mission id to text value of element with class "wikibase-title-label"
  mission['id'] = soup.find(class_="wikibase-title-label").text
  mission['crew'] = findCrew(soup)
  mission['patchURL'] = findPatchURL(mission['id'])

  launch_div = soup.find('div', id="P619")
  landing_div = soup.find('div', id="P620") 
  
  mission['start'] = formatDate(launch_div.find('div', class_="wikibase-snakview-value wikibase-snakview-variation-valuesnak").text)
  if landing_div is not None:
    # Check shuttle mission was not a disaster (i.e. no landing date)
    mission['end'] = formatDate(landing_div.find('div', class_="wikibase-snakview-value wikibase-snakview-variation-valuesnak").text)
  else:
    mission['end'] = None

  return mission

def main():
  # Get the first mission
  url = "https://www.wikidata.org/wiki/Q217543"
  missions = []

  # Get all missions
  while url is not None:
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')

    try:
      mission = generateMissionData(soup)
      
      # download patch image
      if mission['patchURL'] is not None:
        response = requests.get(mission['patchURL'])
        with open(f"./public/patches/{mission['id']}.jpg", 'wb') as outfile:
          outfile.write(response.content)
          mission['patchURL'] = f"/patches/{mission['id']}.jpg"

      print(mission['id'])
      missions.append(mission)
      url = findNextMission(soup)
    except AttributeError as err:
      print(f"Error processing mission {url}")
      raise err

  # write mission data to data.json file
  with open('./public/missions.json', 'w') as outfile:
    json.dump(missions, outfile, indent=2)


if __name__ == '__main__':
  main()



