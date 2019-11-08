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
      { text: 'shell',
        items: [
          { text: 'awk', link: '/note/shell/awk' },
          { text: 'date', link: '/note/shell/date' }
        ]
      },
      { text: 'python',
        items: [
          { text: 'django rest framework', link: '/note/python/drf/'},
          { text: 'celery', link: ''}
        ]
      },
      { text: 'go',
        items: [
          { text: '基础', link: '/note/go/'},
          { text: 'gin', link: ''}
        ]
      },
      { text: '容器',
        items: [
          { text: 'docker', link: '/note/container/docker/' },
          { text: 'k8s', link: '' }
        ]
      },
      { text: '自动化',
        items: [
          { text: 'saltstack', link: '/note/automate/saltstack/' }
        ]
      },
      { text: 'Github', link: 'https://github.com/plsof' }
    ],
    sidebar: [
      {
        title: 'shell',
        collapsable: false, //是否展开
        children: [
          ['/note/shell/awk', 'awk'],
          ['/note/shell/date', 'date']
        ]
      },
      {
        title: 'python',
        collapsable: false,
        children: [
          ['/note/python/drf/', 'Django REST framework'],
        ]
      },
      {
        title: 'go',
        collapsable: false,
        children: [
          ['/note/go/', '基础'],
        ]
      },
      {
        title: '容器',
        collapsable: false,
        children: [
          ['/note/container/docker/', 'Docker'],
        ]
      },
      {
        title: '自动化',
        collapsable: false,
        children: [
          ['/note/automate/saltstack/', 'SaltStack'],
        ]
      }
    ]
  }
}
