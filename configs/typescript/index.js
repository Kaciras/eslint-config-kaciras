/*
 * 使用 overrides 将 TS 的规则限制在 .tsx? 文件，避免冲突。
 */
module.exports = {
	overrides: [{
		files: ["*.ts?(x)"],
		extends: [require.resolve("./base.js")],
	}],
};
