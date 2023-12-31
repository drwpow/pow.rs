---
title: getting started with webpack
description: harnessing the web’s most powerful build tool
date: 2016-10-24
tags: ['dev']
layout: ../../layouts/post.astro
---

<figure><img src="https://miro.medium.com/max/4812/1*yI44h8Df-l-2LUqvXIi8JQ.png"></figure>

_Jun 2017 edit:
[3 was just released](https://medium.com/webpack/webpack-3-official-release-15fd2dd8f07b)! The
syntax for 3.x is identical to 2.x, which means this article is still up-to-date (if I missed
something, please comment!). The version bump was for more behind-the-scenes stuff, but it did add
an easy-to-add “Scope Hoisting” plugin that can cut down on your bundle size that’s worth checking
out! Jump to the bottom of this article for the “Upgrading to 3” section (spoiler: it doesn’t
override anything else in this article)._

## What is webpack?

At its simplest, webpack is a module bundler for your JavaScript. However, since its release it’s
evolved into a manager of all your front-end code (either intentionally or by the community’s will).

<figure><img src="https://miro.medium.com/max/60/1*yBt2rFj2DbckFliGE0LEyg.png?q=20"><figcaption>The old task runner way: your markup, styles, and JavaScript are isolated. You must manage each separately, and it’s your job to make sure everything gets to production properly.</figcaption></figure>

A task runner such as _Gulp_ can handle many different preprocessers and transpilers, but in all
cases, it will take a source _input_ and crunch it into a compiled _output_. However, it does this
on a case-by-case basis with no concern for the system at large. That is the burden of the
developer: to pick up where the task runner left off and find the proper way for all these moving
parts to mesh together in production.

webpack attempts to lighten the developer load a bit by asking a bold question: _what if there were
a part of the development process that handled dependencies on its own? What if we could simply
write code in such a way that the build process managed itself, based on only what was necessary in
the end?_

<figure><img src="https://miro.medium.com/max/60/1*TOFfoH0cXTc8G3Y_F6j3Jg.png?q=20"><figcaption>The webpack way: if webpack knows about it, it bundles only what you’re *actually* using to production.</figcaption></figure>

If you’ve been a part of the web community for the past few years, you already know the preferred
method of solving a problem: _build this with JavaScript_. And so webpack attempts to make the build
process easier by passing dependencies through JavaScript. But the true power of its design isn’t
simply the code _management_ part; it’s that this management layer is 100% valid JavaScript (with
Node features). webpack gives you the ability to write valid JavaScript that has a better sense of
the system at large.

In other words: _you don’t write code for webpack. You write code for your project._ And webpack
keeps up (with some config, of course).

In a nutshell, if you’ve ever struggled with any of the following:

- Loading dependencies out of order
- Including unused CSS or JS in production
- Accidentally double-loading (or triple-loading) libraries
- Encountering scoping issues—both from CSS and JavaScript
- Finding a good system for using NPM packages in your JavaScript, or relying on a crazy backend
  configuration to fully utilize NPM
- Needing to optimize asset delivery better but fearing you’ll break something

…then you could benefit from webpack. It handles all the above effortlessly by letting JavaScript
worry about your dependencies and load order instead of your developer brain. The best part? webpack
runs ahead-of-time, so you can still build
[progressive web apps](https://www.smashingmagazine.com/2016/08/a-beginners-guide-to-progressive-web-apps/),
or apps that don’t even need JS to run.

## First Steps

We’ll use [Yarn](https://yarnpkg.com/) (`brew install yarn`) in this tutorial instead of `npm`, but
it’s totally up to you; they do the same thing. From our project folder, we’ll run the following in
a terminal window to add webpack to our local project:

```
yarn add --dev webpack webpack-dev-server
```

_Note:
_[_using NPM scripts is recommended_](https://webpack.js.org/guides/installation/#local-installation)_,
but for simplicity we’ll be running commands manually in this blog post. Be sure to take advantage
of NPM scripts’ automation in the long-term!_

We’ll then declare a webpack configuration with a `webpack.config.js` file in the root of our
project directory:

```js
const path = require('path');
const webpack = require('webpack');
module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
};
```

_Note: `__dirname` refers to the directory where this `webpack.config.js` lives, which in this blog
post is the project root._

Remember that webpack “knows” what’s going in your project? It _knows_ by reading your code (don’t
worry; it signed an NDA). webpack basically does the following:

1. Starting from the `context` folder, …
1. … it looks for `entry`\*\* \*\*filenames …
1. … and reads the content. Every `import`
   ([ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)) or
   `require()` (Node) dependency it finds as it parses the code, it bundles for the final build. It
   then searches _those_ dependencies, and those dependencies’ dependencies, until it reaches the
   very end of the “tree”—only bundling what it needed to, and nothing else.
1. From there, webpack bundles everything to the `output.path` folder, naming it using the
   ` output.``filename ` naming template (`[name]` gets replaced with the object key from `entry`)

So if our `src/app.js` file looked something like this (assuming we ran `yarn add moment`
beforehand):

```js
import moment from 'moment';
var rightNow = moment().format('MMMM Do YYYY, h:mm:ss a');
console.log(rightNow);
// "October 23rd 2016, 9:30:24 pm"
```

From a terminal, run:

```
node_modules/.bin/webpack -p
```

_Note: The **`p`** flag is “production” mode and uglifies/minifies output. When we run
`node_modules/.bin/`, we’re running the local version of webpack in this project. This is preferred,
because over time and across projects we may have different webpack versions installed, and this
ensures nothing breaks._

And it would output a `dist/app.bundle.js` that logged the current date & time to the console.
webpack automatically knew that `'moment'` referred to the NPM package we installed.

_Tip: `'moment'` works—just that string—because
[inside its `package.json`](https://github.com/moment/moment/blob/develop/package.json#L25), the
`main:` entry points to the core library. Without that, we’d have to explicitly declare the library
we wanted like so:`'moment/moment'` (we can leave off the`.js` at the end). Sometimes it’s worth
inspecting NPM packages because they may include alternate libraries that could save you time or
filesize if you didn’t need the whole library._

# Working with Multiple Files

You can specify any number of entry/output points you wish by modifying only the `entry` object.

### **Multiple files, bundled together**

```js
module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: ['./home.js', './events.js', './vendor.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
};
```

Will all be bundled together as one `dist/app.bundle.js` file, in array order.

### **Multiple files, multiple outputs**

```js
const path = require('path');
const webpack = require('webpack');
module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    home: './home.js',
    events: './events.js',
    contact: './contact.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
};
```

Alternately, you may choose to bundle multiple JS files to break up parts of your app. This will be
bundled as 3 files: `dist/home.bundle.js`, `dist/events.bundle.js`, and `dist/contact.bundle.js`.

### Vendor caching

If you want to separate your vendor libraries into their own bundle so that users don’t have to
re-download your third-party dependencies every time you make a minor app update, you can easily do
that thanks to webpack’s built-in Commons Chunk Plugin:

```js
const webpack = require('webpack');
module.exports = {
  entry: {
    index: './index.js',
    vendor: ['react', 'react-dom'],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
  ],
};
```

_Note: make sure `vendor` in CommonsChunkPlugin matches the `'vendor'` entry name above—it can be
anything as long as it matches an `entry` key._

In this, you’re explicitly telling webpack to use your `vendor` bundle as a commons chunk,
containing your `react` and `react-dom` Node Modules for the entire app. In larger applications
where optimization is key, this can yield better results if you limited your vendor bundle like
this.

Note that by doing this, **you should load **`vendor`** before **`app` in your template. webpack
will often emit something like this:

<pre><code>
<strong>Asset</strong>               <strong>Size</strong>  <strong>Chunks</strong>                   <strong>Chunk</strong> <strong>Names</strong>
<strong>vendor.</strong>bundle.js<strong>  </strong>230<strong> kB </strong>      0 [emitted]         <strong>vendor</strong>
<strong>app</strong>.bundle.js     173 k<strong>B</strong>       1 [emitted]  [big]  <strong>index</strong>
</code></pre>

See how webpack has a `0` chunk, and a `1` chunk? It tells you the order in which it expects them to
load. If you’re writing your own HTML template, you’ll need to include the `<script>` tags in the
proper order, or you can use something like the
[HTML webpack Plugin](https://github.com/jantimon/html-webpack-plugin) to just handle this for you.

_Editor’s note: a previous version of this article listed a second example to automatically extract
duplicate modules across bundles using the Commons Chunk Plugin. That example was removed because
it’s not useful for most beginners, and unless you knew what you were doing it was probably slowing
down your app anyway. If you’d like to learn more about Commons Chunk Plugin’s (many) “hidden”
features, _[_view webpack’s docs_](https://webpack.js.org/plugins/commons-chunk-plugin/)_._

## Developing

webpack actually has its own development server, so whether you’re developing a static site or are
just prototyping your front-end, it’s perfect for either. To get that running, just add a
`devServer` object to `webpack.config.js`:

```diff
  module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
      app: './app.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist', 'assets'),
+     publicPath: '/assets',
    },
    devServer: {
+     contentBase: path.resolve(__dirname, 'src'),
    },
  };
```

Now make a `src/index.html` file that has:

```
<script src="/assets/app.bundle.js"></script>
```

… and from your terminal, run:

```
node_modules/.bin/webpack-dev-server
```

Your server is now running at `localhost:8080`. _Note how _`_/assets_`_ in the script tag matches
_`_output.publicPath_`_—this prefixes all asset URLs, so you can load assets from anywhere you need
to\_\_ (useful if you use a CDN)._

webpack will hotload any JavaScript changes as you make them without the need to refresh your
browser. However, **any changes to the **`**webpack.config.js**`** file will require a server
restart** to take effect.

## Globally-accessible methods

Need to use some of your functions from a global namespace? Simply set `output.library` within
`webpack.config.js`:

```js
module.exports = {
  output: {
    library: 'myClassName',
  },
};
```

… and it will attach your bundle to a `window.myClassName` instance. So using that name scope, you
could call methods available to that entry point (you can read more about this setting
[on the documentation](https://webpack.js.org/concepts/output/#output-library)).

## Loaders

Up until now, we’ve only covered working with JavaScript. It’s important to start with JavaScript
because _that’s the only language webpack speaks_. We can work with virtually any file type, as long
as we pass it into JavaScript. We do that with _Loaders_.

A loader can refer to a preprocessor such as Sass, or a transpiler such as Babel. On NPM, they’re
usually named `*-loader` such as `sass-loader` or `babel-loader`.

### Babel + ES6

If we wanted to use ES6 via [Babel](https://babeljs.io) in our project, we’d first install the
appropriate loaders locally:

```
yarn add --dev babel-loader babel-core babel-preset-env
```

… and then add it to `webpack.config.js` so webpack knows where to use it.

```js
module.exports = {
  // …
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['env'] },
          },
        ],
      },
      // Loaders for other file types can go here
    ],
  },
  // …
};
```

_A note for webpack 1.x users: the core concept for
_[_Loaders_](https://webpack.js.org/concepts/loaders/)_ remains the same, but the syntax has
improved._

This looks for the `/\.js$/` RegEx search for any files that end in `.js` to be loaded via Babel.
webpack relies on regex tests to give you complete control, not limiting you to only file extensions
or assume your code must be organized in a certain way.

If you find a loader mangling files, or otherwise processing things it shouldn’t, you can specify an
`exclude` option to skip certain files. Here, we excluded our `node_modules` folder from being
processed by Babel—we don’t need it. But we also could apply this to any of our own project files,
for example if we had a `my_legacy_code` folder. This doesn’t prevent you from loading these files;
rather, you’re just letting webpack know it’s OK to import as-is and not process them.

## CSS + Style Loader

If we wanted to only load CSS as our application needed, we could do that as well. Let’s say we have
an `index.js` file. We’ll import it from there:

```js
import styles from './assets/stylesheets/application.css';
```

We’ll get the following error: `You may need an appropriate loader to handle this file type`.
Remember that webpack can only understand JavaScript, so we’ll have to install the appropriate
loader:

```
yarn add --dev css-loader style-loader
```

… and then add a rule to `webpack.config.js`:

```diff
  module.exports = {
    // …
    module: {
+     rules: [
+       {
+         test: /\.css$/i,
+         use: ['style-loader', 'css-loader'],
+       },
        // …
      ],
    },
  };
```

_Loaders are processed in _**_reverse array order_**_.\_\_ That means _`_css-loader_`_ will run
before _`_style-loader_`_._

You may notice that even in production builds, this actually bundles your CSS in with your bundled
JavaScript, and `style-loader` manually writes your styles to the `<head>`. At first glance it may
seem a little kooky, but slowly starts to make more sense the more you think about it. You’ve saved
a header request—saving valuable time on some connections—and if you’re loading your DOM with
JavaScript anyway, this essentially eliminates
[FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) on its own.

You’ll also notice that—out of the box—webpack has automatically resolved all of your `@import`
queries by packaging those files together as one (rather than relying on CSS’s default import which
can result in gratuitious header requests and slow-loading assets).

Loading CSS from your JS is pretty amazing, **because you now can modularize your CSS in powerful
new ways.** Say you loaded `button.css` only through `button.js`. This would mean if `button.js` is
never actually used\_, \_its CSS wouldn’t bloat out our production build. If you adhere to
component-oriented CSS practices such as SMACSS or BEM, you see the value in pairing your CSS more
closely with your markup + JavaScript.

### CSS + Node Modules

We can use webpack to take advantage of importing Node Modules using Node’s `~` prefix. If we ran
` yarn`` ``add normalize.css `, we could use:

```css
@import '~normalize.css';
```

… and take full advantage of NPM managing our third party styles for us—versioning and all—without
any copy + pasting on our part. Further, getting webpack to bundle CSS for us has obvious advantages
over using CSS’s default import, saving the client from gratuitous header requests and slow load
times.

_Update: this and the following section have been updated for accuracy, no longer confusing using
CSS Modules to simply import Node Modules. Thanks to
[Albert Fernández](https://medium.com/u/901a038e32e5?source=post_page-----ed2b86c68783--------------------------------)
for the help!_

### CSS Modules

You may have heard of [CSS Modules](https://github.com/css-modules/css-modules), which takes the _C_
out of _CSS_. It typically works best only if you’re building the DOM with JavaScript, but in
essence, it magically scopes your CSS classes to the JavaScript file that loaded it
([learn more about it here](https://github.com/css-modules/css-modules)). If you plan on using it,
CSS Modules comes packaged with `css-loader` (`yarn add --dev css-loader`):

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true },
          },
        ],
      },
    ],
  },
};
```

_Note: for `css-loader` we’re now using the **expanded object syntax** to pass an option to it. You
can use a string instead as shorthand to use the default options, as we’re still doing with
`style-loader`._

It’s worth noting that you can actually drop the `~` when importing Node Modules with CSS Modules
enabled (e.g.: `@import "normalize.css";`). However, you may encounter build errors now when you
`@import` your own CSS. If you’re getting “can’t find \_\_\_” errors, try adding a `resolve` object
to `webpack.config.js` to give webpack a better understanding of your intended module order.

```js
module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
};
```

We specified our source directory first, and then `node_modules`. So webpack will handle resolution
a little better, first looking through our source directory and then the installed Node Modules, in
that order (replace `"src"` and `"node_modules"` with your source and Node Module directories,
respectively).

### Sass

Need to use Sass? No problem. Install:

```
yarn add --dev sass-loader node-sass
```

And add another rule:

```diff
  module.exports = {
    module: {
      rules: [
+       {
+         test: /\.(sass|scss)$/i,
+         use: ['style-loader', 'css-loader', 'sass-loader'],
+       },
      ],
    },
  };
```

Then when your Javascript calls for an `import` on a `.scss` or `.sass` file, webpack will do its
thing. Remember: the order of `use` is backward, so we’re loading Sass first, followed by our CSS
parser, and finally Style loader to load our parsed CSS into the `<head>` of our page.

### CSS bundled separately

Maybe you’re dealing with progressive enhancement; maybe you need a separate CSS file for some other
reason. We can do that easily by swapping out `style-loader` with `extract-text-webpack-plugin` in
our config without having to change any code. Take our example `app.js` file:

```js
import styles from './assets/stylesheets/application.css';
```

Let’s install the plugin locally…

```
yarn add --dev extract-text-webpack-plugin
```

… and add to `webpack.config.js`:

```diff
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  module.exports = {
    module: {
      rules: [
+       {
+         test: /\.css$/i,
+         use: ExtractTextPlugin.extract({
+           use: [
+             {
+               loader: 'css-loader',
+               options: { importLoaders: 1 },
+             },
+           ],
+         }),
+       },
      ],
    },
    plugins: [
+     new ExtractTextPlugin({
+       filename: '[name].bundle.css',
+       allChunks: true,
+     }),
    ],
  };
```

Now when running `node_modules/.bin/webpack -p` you’ll also notice an `app.bundle.css` file in your
`output` directory. Simply add a `<link>` tag to that file in your HTML as you would normally.

### HTML

As you might have guessed, there’s also an
`[html-loader](https://github.com/webpack/html-loader)`[ plugin](https://github.com/webpack/html-loader)
for webpack. However, when we get to loading HTML with JavaScript, this is about the point where we
branch off into a myriad of differing approaches, and I can’t think of one single example that would
set you up for whatever you’re planning on doing next. Typically, you’d load HTML for the purpose of
using JavaScript-flavored markup such as [JSX](https://jsx.github.io/) or
[Mustache](https://github.com/janl/mustache.js/) or [Handlebars](http://handlebarsjs.com/) to be
used within a larger system such as [React](https://facebook.github.io/react/),
[Vue](http://vuejs.org/), or [Angular](https://angularjs.org/). Or you’re using a pre-processor such
as [Pug](https://github.com/pugjs/pug-loader) (formerly Jade). Or you could just be literally
pushing the same HTML from your source directory into your build directory. Whatever you’re doing, I
won’t assume.

So I’ll end the tutorial here: loading markup with webpack is _highly encouraged_ and doable, but by
this point you’ll be making your own decisions about your architecture that neither I nor webpack
can make for you. But using the above examples for reference and searching for the right loaders on
NPM should be enough to get you going.

## Thinking in Modules

In order to get the most out of webpack, you’ll have to think in modules—small, reusable,
self-contained processes that do one thing and one thing well. That means taking something like
this:

```
└── js/
    └── application.js   // 300KB of spaghetti code
```

… and turning it into this:

```
└── js/
    ├── components/
    │   ├── button.js
    │   ├── calendar.js
    │   ├── comment.js
    │   ├── modal.js
    │   ├── tab.js
    │   ├── timer.js
    │   ├── video.js
    │   └── wysiwyg.js
    │
    └── index.js  // ~ 1KB of code; imports from ./components/</span>
```

The result is clean, reusable code. Each individual component depends on `import`-ing its own
dependencies, and `export`-ing what it wants to make public to other modules. Pair this with Babel +
ES6, and you can utilize
[JavaScript Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) for
great modularity, and \_don’t-think-about-it \_scoping that just works.

For more on modules, see
[this excellent article by Preethi Kasireddy](https://medium.freecodecamp.com/javascript-modules-a-beginner-s-guide-783f7d7a5fcc).

## Upgrading to 3

According to

[Sean T. Larkin](https://medium.com/u/393110b0b9e4?source=post_page-----ed2b86c68783--------------------------------)
in the [release blog post](https://medium.com/webpack/webpack-3-official-release-15fd2dd8f07b#c11e):
“Migrating from webpack 2 to 3, should involve **_no effort beyond running the upgrade commands in
your terminal._** We marked this as a Major change because of internal breaking changes that could
affect some plugins.”

Version 3 did add a nifty feature: _scope hoisting\_\_._ This is a special name to describe a newer
method to bundle all your modules together in one manifest. Best case scenario: it can reduce your
bundle size by **almost half** ([source](https://twitter.com/tizmagik/status/876128847682523138)).
Worst case scenario: scope hoisting doesn’t work for your special bundle, and it outputs almost
identical code to what it did in version 2.x.

To add it, just add the following line to `plugins`:

```diff
  module.exports = {
    plugins: [
+     new webpack.optimize.ModuleConcatenationPlugin()
    ],
  };
```

Read more about
[Scope Hoisting here](https://medium.com/webpack/webpack-3-official-release-15fd2dd8f07b#c11e).

## Further Reading

- [Configuring webpack for production: High Performance webpack config](https://www.codementor.io/drewpowers/high-performance-webpack-config-for-front-end-delivery-90sqic1qa)
- [What’s New in webpack 2](https://gist.github.com/sokra/27b24881210b56bbaff7)
- w[ebpack + PostCSS + cssnext](https://blog.madewithenvy.com/webpack-2-postcss-cssnext-fdcd2fd7d0bd#.asbpg46l1)
- [webpack Config docs](https://webpack.js.org/configuration/)
- [webpack Examples](https://github.com/webpack/webpack/tree/master/examples)
- [React + webpack Starter Kit](https://github.com/kriasoft/react-starter-kit)
- [webpack How-to](https://github.com/petehunt/webpack-howto)
