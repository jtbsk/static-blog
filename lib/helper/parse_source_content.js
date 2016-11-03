export default data => {
  const split = '---\r\n'
  const i = data.indexOf(split)
  const post = {}
  if (i !== -1) {
    const j = data.indexOf(split, i + split.length)
    if (j !== -1) {
      const metaData = data.slice(i + split.length, j).trim()
      data = data.slice(j + split.length)
      metaData.split('\r\n').forEach(line => {
        const arr = line.split(':')
        post[arr[0].trim()] = arr[1].trim()
      })
    }
  }
  post.source = data
  return post
}
