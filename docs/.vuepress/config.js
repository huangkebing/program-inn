module.exports = {
    port: "8080",
    dest: ".site",
    base: "/",
    markdown: {
        lineNumbers: true,
        externalLinks: {
            target: '_blank', rel: 'noopener noreferrer'
        }
    },
    locales: {
        "/": {
            lang: "zh-CN",
            title: "program-inn",
            description: "记录，成为更好的自己"
        }
    },
    head: [
        ["link", {rel: "icon", href: `/images/system/favicon.ico`}]
    ],
    plugins: [
        ['@vuepress/medium-zoom', {selector: 'img:not(.nozoom)', options: {margin: 16}}],
        ['vuepress-plugin-code-copy', {align: 'bottom', color: '#3eaf7c'}],
        ['vuepress-plugin-mermaidjs'],
        ['vuepress-plugin-right-anchor', {
            showDepth: 3,
            ignore: ['/'],
            expand: {trigger: 'click', clickModeDefaultOpen: false},
            customClass: 'customClass',
        }]
    ],
    themeConfig: {
        nav: [
            {
                text: '导读',
                link: '/md/guide/2024-01-01-1-guide.md'
            },
            {
                text: 'Java',
                items: [
                    {
                        text: '容器',
                        link: ''
                    },
                    {
                        text: '并发',
                        link: '/md/java/thread/2023-12-28-1-并发的基本概念.md'
                    },
                    {
                        text: 'JVM',
                        link: '/md/java/jvm/2023-05-26-1-JVM概览.md'
                    }
                ]
            },
            {
                text: 'Spring',
                items: [
                    {
                        text: 'spring framework',
                        link: '/md/spring/spring-framework/2023-11-14-1-前言&环境构建.md'
                    },
                    {
                        text: 'spring framework源码',
                        link: '/md/spring/spring-framework-code/BeanDefinition/2023-11-24-1-BeanDefinition概述.md'
                    },
                    {
                        text: 'Spring Cloud',
                        link: '/md/spring/spring-cloud/2023-08-18-1-SpringCloud尝试.md'
                    }
                ]
            },
            {
                text: '算法',
                items: [
                    {
                        text: '剑指offer系列',
                        link: '/md/algorithm/offer/2023-05-10-1-剑指offer.md'
                    },
                    {
                        text: '剑指offerⅡ系列',
                        link: '/md/algorithm/offer2/2023-08-02-1-剑指offer2.md'
                    },
                    {
                        text: '专项系列',
                        link: '/md/algorithm/point/2023-06-13-1-排序专项.md'
                    }
                ]
            },
            {
                text: '基础巩固',
                items: [
                    {
                        text: '计算机网络',
                        link: ''
                    }
                ]
            },
            {
                text: '工具杂记',
                link: '/md/utils/2023-01-01-1-blogs.md'
            },
            {
                text: 'github',
                link: 'https://github.com/huangkebing'
            }
        ],
        sidebar: {
            "/md/java/thread/": getBarJavaThread(),
            "/md/java/jvm/": getBarJavaJvm(),
            "/md/spring/spring-framework/": getBarSpringFramework(),
            "/md/spring/spring-framework-code/": getBarSpringFrameworkCode(),
            "/md/spring/spring-cloud/": getBarSpringCloud(),
            "/md/algorithm/offer/": getBarAlgorithmOffer(),
            "/md/algorithm/offer2/": getBarAlgorithmOfferTwo(),
            "/md/algorithm/point/": getBarAlgorithmPoint(),
            "/md/utils/": getBarUtils(),
        },
        lastUpdated: '更新时间'
    }
};

function getBarJavaThread(){
    return [
        {
            title: "并发系列",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "2023-12-28-1-并发的基本概念.md",
            ]
        },
    ]
}

function getBarJavaJvm(){
    return [
        {
            title: "概览",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "2023-05-26-1-JVM概览.md",
            ]
        },
    ]
}

function getBarSpringFramework(){
    return [
        {
            title: "spring framework",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "2023-11-14-1-前言&环境构建.md",
                "2023-11-15-2-IoC概念容器和bean定义.md"
            ]
        },
    ]
}

function getBarSpringFrameworkCode(){
    return [
        {
            title: "BeanDefinition篇",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "BeanDefinition/2023-11-24-1-BeanDefinition概述.md",
            ]
        },
        {
            title: "BeanFactory篇",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "BeanFactory/2023-11-28-1-BeanFactory概述.md",
                "BeanFactory/2023-12-28-2-AliasRegistry.md"
            ]
        },
    ]
}

function getBarSpringCloud(){
    return [
        {
            title: "Spring Cloud系列",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "2023-08-18-1-SpringCloud尝试.md",
            ]
        }
    ]
}

function getBarAlgorithmOffer(){
    return [{
        title: "剑指offer系列",
        collapsable: false,
        sidebarDepth: 1,
        children: [
            "2023-05-10-1-剑指offer.md",
            "2023-05-20-2-剑指offer.md",
            "2023-05-30-3-剑指offer.md",
            "2023-06-11-4-剑指offer.md",
            "2023-06-25-5-剑指offer.md",
            "2023-07-05-6-剑指offer.md",
            "2023-07-17-7-剑指offer.md"
        ]}
    ]
}

function getBarAlgorithmOfferTwo(){
    return [{
        title: "剑指offerⅡ系列",
        collapsable: false,
        sidebarDepth: 1,
        children: [
            "2023-08-02-1-剑指offer2.md",
            "2023-08-16-2-剑指offer2.md",
            "2023-09-05-3-剑指offer2.md",
            "2023-09-23-4-剑指offer2.md",
            "2023-10-25-5-剑指offer2.md"
        ]}
    ]
}

function getBarAlgorithmPoint(){
    return [{
        title: "算法专项",
        collapsable: false,
        sidebarDepth: 0,
        children: [
            "2023-06-13-1-排序专项.md",
            "2023-08-14-2-位运算专项.md"
        ]}
    ]
}

function getBarUtils(){
    return [{
        title: "工具杂记",
        collapsable: false,
        sidebarDepth: 0,
        children: [
            "2023-01-01-1-blogs.md",
            "2023-04-26-2-commonslang3.md",
            "2023-10-25-3-mermaid.md"
        ]}
    ]
}