# 项目及规则的目标

- 尽可能集成更多的配置项，减少使用方的`eslintrc`代码。

- 使代码风格在不同语言之间保持一致，减少切换负担。比如使用双引号表示字符串，因为很多语言有字符类型使用了单引号，同样还有行尾要加分号等等。

- 关闭一些容易误报，以及过时的规则。

- 代码风格类的规则，如果 IDE 的格式化能够处理则不会出现在本项目中。

# 不使用的插件

以下第三方插件经过了评价，最终决定不使用：

- [eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise) 5.1.0，没有需要的规则。

- [eslint-plugin-node](https://github.com/mysticatea/eslint-plugin-node) 11.1.0，没有需要的规则。

- [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import) 2.22.1，没有需要的规则。

- [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) 31.0.0，它基于 JS 而不是 TS，缺乏类型信息导致误报太多。
