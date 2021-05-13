# 项目及规则的目标

- 尽可能集成更多的配置项，减少使用方的`eslintrc`代码。

- 使代码风格在不同语言之间保持一致，减少切换负担。比如使用双引号表示字符串，因为很多语言有字符类型使用了单引号，同样还有行尾要加分号等等。

- 关闭一些容易误报，以及过时的规则。

# 不使用的插件

以下第三方插件经过了评价，最终决定不使用：

- [eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise) 5.1.0，没有需要的规则。

- [eslint-plugin-node](https://github.com/mysticatea/eslint-plugin-node) 11.1.0，没有需要的规则。

- [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import) 2.22.1，没有需要的规则。

- [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) 31.0.0，它基于 JS 而不是 TS，缺乏类型信息导致误报太多。

# 可能添加的规则

想到了一些可能有用的规则，但尚未实现，在此记录一下。

## 导入排序

我习惯将导入部分按照`内置模块`-`第三方库`-`本项目的模块`顺序排列。 但由于模块可能有副作用，导入顺序会对结果产生影响，所以没有实现这一功能。
