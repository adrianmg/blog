const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'Andrew Branch',
    description: 'A blog about coding and maybe other stuff. Who knows?',
    author: '@atcb',
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-typescript-checker',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-emotion',
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/posts`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          `${__dirname}/gatsby-remark-annotate-code-blocks`,
          'gatsby-remark-katex',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 760
            }
          },
          'gatsby-remark-static-images'
        ]
      }
    },
    'gatsby-plugin-webpack-bundle-analyzer',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-47339312-2',
        anonymize: true,
        respectDNT: true,
      },
    },
    {
      resolve: 'gatsby-plugin-s3',
      options: {
        bucketName: 'blog.andrewbran.ch',
        region: 'us-west-1',
        protocol: 'https',
        hostname: 'beta.blog.andrewbran.ch',
        removeNonexistentObjects: true,
      },
    },
    'gatsby-plugin-favicon',
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
