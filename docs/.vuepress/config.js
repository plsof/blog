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
          { text: 'python基础', link: '/note/python/base/' },
          { text: 'django rest framework', link: '/note/python/drf/' },
          // { text: 'celery', link: ''}
        ]
      },
      { text: 'go',
        items: [
          { text: '学习笔记', link: '/note/go/basic/' },
          { text: 'gorm', link: '/note/go/gorm/' },
          // { text: 'gin', link: ''}
        ]
      },
      {
        text: '数据库',
        items: [
          { text: 'etcd', link: '/note/db/etcd/' }
        ]
      },
      { text: '云原生',
        items: [
          { text: 'docker', link: '/note/cloud-native/docker/' },
          { text: 'docker-compose', link: '/note/cloud-native/docker-compose/' },
          { text: 'kubernetes', link: '/note/cloud-native/kubernetes/' },
          { text: 'harbor', link: '/note/cloud-native/harbor/' }
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
      '/note/python/base/': [
        'class',
      ],
      '/note/python/drf/': [
        'views',
        'generics',
        'mixins',
        'viewsets',
        'serializers'
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
        'other',
      ],
      '/note/go/gorm/': [
        ''
      ],
      '/note/db/etcd/': [
        ''
      ],
      '/note/cloud-native/docker/': [
        ''
      ],
      '/note/cloud-native/docker-compose/': [
        ''
      ],
      '/note/cloud-native/kubernetes/': [
        'overview',
        'install',
        // 'clusterArchitecture',
        // 'containers',
        'workloads',
        'servicesLoadbalancingNetworking',
        'storage',
        'clusterAdministration',
        'network',
        'helm',
        'monitoring',
        'efk',
        'dashboard',
        'deploymentStrategies'
      ],
      '/note/cloud-native/harbor/': [
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
