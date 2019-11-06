module.exports = {
  head:[
    ['link', {rel:'icon', href:'/assets/img/logo.png'}]
  ],
  base: '/blog/',
  title: 'seize the day',
  description: 'Vuepress blog',
  themeConfig: {
    logo: '/assets/img/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/note/linux/awk/' },
      { text: 'Github', link: 'https://github.com/plsof' }
    ],
    sidebar: [
      {
        title: 'Linux',
        collapsable: false, //是否展开
        children: [
          ['./note/linux/awk', 'awk'],
          ['./note/linux/date', 'date']
        ]
      },
      {
        title: 'Docker',
        collapsable: false,
        children: [
          ['./note/docker/image', '镜像'],
          ['./note/docker/dockerfile', 'Dockerfile'],
          ['./note/docker/container', '容器']
        ]
      },
      {
        title: 'Django',
        collapsable: false,
        children: [
          ['./note/django/rfw', 'REST framework'],
        ]
      },
      {
        title: 'Go',
        collapsable: false,
        children: [
          ['./note/go/basic', '基础'],
        ]
      }
    ]
  }
}
