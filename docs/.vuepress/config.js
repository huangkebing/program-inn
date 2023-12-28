module.exports = {
    port: "8080",
    dest: ".site",
    base: "/program-inn/",
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
        ["link", {rel: "icon", href: `/favicon.ico`}]
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
                text: 'Java',
                items: [
                    {
                        text: '容器',
                        link: '/md/java/interview/2020-07-28-面经手册 · 开篇《面试官都问我啥》.md'
                    },
                    {
                        text: 'JVM',
                        link: '/md/java/jvm/2023-05-26-1-JVM概览.md'
                    },
                    {
                        text: '基础技术',
                        link: '/md/java/core/2020-01-06-[源码分析]咋嘞？你的IDEA过期了吧！加个Jar包就破解了，为什么？.md'
                    }
                ]
            },
            {
                text: 'Spring',
                items: [
                    {
                        text: 'Spring 手撸专栏',
                        link: '/md/spring/develop-spring/2021-05-16-第1章：blogs.md'
                    },
                    {
                        text: 'spring framework源码',
                        link: '/md/spring/spring-framework-code/BeanDefinition/2023-11-24-1-BeanDefinition概述.md'
                    },
                    {
                        text: 'Spring Cloud',
                        link: '/md/spring/spring-cloud/2019-10-31-Spring Cloud零《总有一偏概述告诉你SpringCloud是什么》.md'
                    },
                    {
                        text: '源码分析(Mybatis、Quartz)',
                        link: '/md/spring/source-code/2019-12-25-[源码分析]Mybatis接口没有实现类为什么可以执行增删改查.md'
                    }
                ]
            },
            {
                text: '算法',
                items: [
                    {
                        text: '数据结构',
                        link: '/md/algorithm/data-structures/data-structures.md'
                    },
                    {
                        text: '算法主题',
                        link: '/md/algorithm/logic/math/math.md'
                    },
                    {
                        text: '机器学习',
                        link: '/md/algorithm/model/2023-02-12-chat-gpt.md'
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
            "/md/java/jvm/": getBarJavaJvm(),
            "/md/spring/spring-framework-code/": getBarSpringFrameworkCode(),
            "/md/utils/": getBarUtils(),
        },
        lastUpdated: '更新时间'
    }
};

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