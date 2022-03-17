import { blur } from '@utils/blur'
import { ImageProps } from 'next/image'
import { Node } from 'unist'
import { visit } from 'unist-util-visit'

type ImageNode = {
  type: 'mdxJsxFlowElement'
  name: 'Image'
  attributes: {
    [K in keyof ImageProps]: {
      type: 'mdxJsxAttribute'
      name: K
      value: ImageProps[K]
    }
  }[keyof ImageProps][]
}
const isImageNode = (node: Node): node is ImageNode => {
  const img = node as ImageNode
  return (
    img.type === 'mdxJsxFlowElement' &&
    img.name === 'Image' &&
    img.attributes &&
    typeof img.attributes.find(({ name }) => name === 'src').value === 'string'
  )
}

const addProps = async (node: ImageNode): Promise<void> => {
  const src = node.attributes.find(({ name }) => name === 'src').value

  const blur64 = await blur(src)

  node.attributes.push({
    type: 'mdxJsxAttribute',
    name: 'blurDataURL',
    value: blur64,
  })
  node.attributes.push({
    type: 'mdxJsxAttribute',
    name: 'placeholder',
    value: 'blur',
  })
}

const imageMetadata = () => {
  return async function transformer(tree: Node): Promise<Node> {
    const images: ImageNode[] = []

    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (isImageNode(node)) {
        images.push(node)
      }
    })

    for (const image of images) {
      await addProps(image)
    }

    return tree
  }
}

export default imageMetadata
