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
      { text: 'linux',
        items: [
          { text: 'awk', link: '/note/linux/awk' },
          { text: 'date', link: '/note/linux/date' }
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
          { text: '学习笔记', link: '/note/go/basic/' },
          { text: 'go-restful', link: ''}
        ]
      },
      {
        text: '数据库',
        items: [
          { text: 'etcd', link: '/note/db/etcd/' }
        ]
      },
      { text: '容器',
        items: [
          { text: 'docker', link: '/note/container/docker/' },
          { text: 'k8s', link: '/note/container/k8s/' },
          { text: 'harbor', link: '/note/container/harbor/' }
        ]
      },
      { text: '监控',
        items: [
          { text: 'prometheus', link: '/note/monitor/prometheus/' },
        ]
      },
      { text: '配置管理',
        items: [
          { text: 'confd', link: '/note/configuration-management/confd/' },
          { text: 'saltstack', link: '/note/configuration-management/saltstack/' }
        ]
      },
      { text: 'Github', link: 'https://github.com/plsof' }
    ],
    // sidebar: 'auto',
    sidebar: {
      '/note/guide/': [
        ''
      ],
      '/note/linux/': [
        'awk',
        'date'
      ],
      '/note/python/drf/': [
        ''
      ],
      '/note/go/basic/': [
        'programStructure',
        'basicDataType',
        'compositeType',
        'functions',
        'methods',
        'interfaces',
        'oop',
        'files',
        'cmd',
        'serializer',
        'Goroutine-Channel',
      ],
      '/note/db/etcd/': [
        ''
      ],
      '/note/container/docker/': [
        ''
      ],
      '/note/container/k8s/': [
        'overview',
        'cluster-architecture',
        'containers',
        'workloads',
        'services-load_balancing-networking',
        'cluster-administration',
        'flannel',
        'dashboard'
      ],
      '/note/container/harbor/': [
        ''
      ],
      '/note/monitor/prometheus/': [
        '',
        'examples/'
      ],
      '/note/configuration-management/confd/': [
        ''
      ],
      '/note/configuration-management/saltstack/': [
        ''
      ]
    },
    sidebarDepth: 2
  }
}
