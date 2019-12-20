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
          { text: '基础', link: '/note/go/' },
          { text: 'gin', link: ''}
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
          { text: 'k8s', link: '/note/container/k8s/' }
        ]
      },
      { text: '监控',
        items: [
          { text: 'prometheus', link: '/note/monitor/prometheus/' },
          { text: 'node_exporter', link: '' }
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
      '/note/go/': [
        ''
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
        'flannel'
      ],
      '/note/monitor/prometheus/': [
        ''
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
