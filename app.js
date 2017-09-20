const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const logUtil = require('./utils/log_util');
const jwtConfig = require('./config/jwt_config');
const router = require('./routers/route');
// error handler
onerror(app);

// middlewares
app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}));

// jwt
app.use(koaJwt({secret: jwtConfig.secret}).unless({
	path: [/^\/api\/login/]		// 数据中的路径不需要要通过jwt验证
}));

app.use(json());

app.use(koaStatic(__dirname + '/public'));

app.use(views(__dirname + '/views', {
	extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
	// 响应开始时间
	const start = new Date();
	// 响应间隔时间
	var ms;
	try {
		// 开始进入到下一个中间件
		await next();
		ms = new Date() - start;
		// 记录响应日志
		logUtil.logResponse(ctx, ms);
	} catch (error) {
		ms = new Date() - start;
		// 记录异常日志
		logUtil.logError(ctx, error, ms);
	}
});

// 路由入口
app.use(router.routes())
	.use(router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
});

module.exports = app;