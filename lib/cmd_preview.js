import express from 'express'
import path from 'path'
import marked from 'marked'
import open from 'open'
import ejs from 'ejs'
import errorhandler from 'errorhandler'
import fsp from 'fs-promise'
import * as helper from './helper'

export default (dir = './') => {

  const app = express()

  // 以 /assets 开头的 URL 为博客中用到的静态资源文件，对应的是博客根目录下的 assets 目录
  app.use('/assets', express.static('./assets'))

  // 渲染列表
  app.get('/', (req, res, next) => {
    res.send('文章列表')
  })

  // 渲染文章
  // 以 /posts 开头的 URL 为文章内容页面，比如访问的 URL 是 /posts/2016/11/hello_world.html
  // 对应的源文件就是 _posts/2016/11/hello-world.md
  app.get('/posts/*', (req, res, next) => {
    const filePath = `./_posts/${req.params[0].split('.')[0]}.md`
    fsp.access(filePath)
      .then(() => {
        return fsp.readFile(filePath, 'utf8')
      })
      .catch(err => {
        res.send('404 Not Found.')
      })
      .then(data => {
        if (!data) {
          return
        }

        // 解析文章元数据
        const post = helper.parseSourceContent(data)

        // 解析 Markdown
        post.content = marked(post.source)

        ejs.renderFile('./_layout/post.html', { post }, (err, str) => {
          if (err) {
            return next(err)
          }
          res.send(str)
        })
      })
      .catch(err => {
        return next(err)
      })
  })

  // 错误处理
  if (process.env.NODE_ENV === 'develoment') {
    app.use(errorhandler({ log: helper.errorNotification }))
  }

  app.listen(3000, () => {
    console.log('Available on:')
    console.log('  http://127.0.0.1:3000/')
    console.log('Hit CTRL-C to stop the server.')
    open('http://127.0.0.1:3000/')
  })
}
