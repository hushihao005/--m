// Postcss配置文件

module.exports = {
  // 配置要使用的postcss插件
  plugins: {
    // 配置autoprefixed插件
    // 作用是生成浏览器css样式规则前缀
    // vue-cli内部已经配置了autoprefixed插件, 所以不需要再自己配置
    // 'autoprefixed': {
    //   // 配置要兼容到的设备系统信息
    //   browsers: ['Android >= 4.0', 'ios >= 8']
    // },
    // 配置postcss-pxtorem插件
    // px转成rem
    'postcss-pxtorem': {
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],
      // 排除不需要转换的样式资源
      exclude:'github-markdown'
    },
  },
};
