import notifier from 'node-notifier'

export default (err, str, req) => {
  const title = `Error in ${req.method} ${req.url}`
  notifier.notify({
    title: title,
    message: str
  })
}
