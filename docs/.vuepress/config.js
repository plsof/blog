module.exports = {
  head: [
    ['link', { rel: 'icon', href: '/assets/img/favicon.ico' }]
  ],
  base: '/blog/',
  title: 'plsof',
  description: 'Vuepress blog',
  themeConfig: {
    logo: '/assets/img/sheep.png',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Linux',
        items: [
          { text: 'awk', link: '/note/linux/awk' },
          { text: 'date', link: '/note/linux/date' }
        ]
      },
      {
        text: 'Python',
        items: [
          { text: '数据类型', link: '/note/python/datatypes/' },
          { text: '函数', link: '/note/python/function/' },
          { text: '面向对象', link: '/note/python/oop/' },
          { text: '日志', link: '/note/python/log/' },
          { text: '网络', link: '/note/python/network/' }
          // { text: 'celery', link: ''}
        ]
      },
      {
        text: 'Golang',
        items: [
          { text: '基础', link: '/note/go/basic/' },
          { text: 'gin', link: '/note/go/gin/' },
          { text: 'gorm', link: '/note/go/gorm/' }
        ]
      },
      {
        text: '前端',
        items: [
          { text: 'css', link: '/note/frontend/css/'},
          { text: 'js', link: '/note/frontend/js/'},
          { text: 'vue', link: '/note/frontend/vue/'}
        ]
      },
      {
        text: '数据库',
        items: [
          { text: 'etcd', link: '/note/db/etcd/' },
          { text: 'redis', link: '/note/db/redis/' }
        ]
      },
      {
        text: '云原生',
        items: [
          { text: 'docker', link: '/note/cloud-native/docker/' },
          { text: 'docker-compose', link: '/note/cloud-native/docker-compose/' },
          { text: 'kubernetes', link: '/note/cloud-native/kubernetes/' },
          { text: 'harbor', link: '/note/cloud-native/harbor/' }
        ]
      },
      {
        text: '监控',
        items: [
          { text: 'prometheus', link: '/note/monitor/prometheus/' },
        ]
      },
      {
        text: '配置管理',
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
      '/note/python/oop/': [
        '',
      ],
      '/note/python/datatypes/': [
        '',
      ],
      '/note/python/function/': [
        '',
      ],
      '/note/python/network/': [
        'ipaddress',
        'netifaces',
        'paramiko'
      ],
      '/note/python/log/': [
        'logging'
      ],
      '/note/python/drf/': [
        'views',
        'generics',
        'mixins',
        'viewsets',
        'serializers'
      ],
      '/note/go/basic/': [
        'datatype',
        // 'basicDataType',
        // 'compositeType',
        'functions',
        'methods',
        'interfaces',
        // 'oop',
        'serializer',
        'Goroutine-Channel',
        'io',
        'network',
        'system',
        'reflect',
        'other',
      ],
      '/note/go/gorm/': [
        ''
      ],
      '/note/go/gin/': [
        'middleware',
        'websocket'
      ],
      '/note/frontend/css/': [
        ''
      ],
      '/note/frontend/js/': [
        ''
      ],
      '/note/frontend/vue/': [
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
