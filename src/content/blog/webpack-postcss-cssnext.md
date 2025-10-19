---
title: webpack + postcss + cssnext
description: writing future CSS in a modern JS setup
pubDate: 2016-11-25
categories: ['dev']
layout: ../../layouts/post.astro
---

<figure><img src="https://miro.medium.com/max/1400/1*YuzakcmBI7vlrwuWdkIeUA.jpeg"><figcaption>© http://www.zazzle.com/stevenfrank</figcaption></figure>

# Obligatory preamble

I’m a Sass man (ˢᵏᶦᵇᵃᵇᵒᵖᵇᵃᵈᵒᵖᵇᵒᵖ). I’ve been hooked on Sass for over 5 years, and I still love it.
This isn’t an _everybody-should-use-PostCSS_ post, because Sass still holds some advantages, and
despite what Medium tells you, your stack doesn’t need to be rewritten every other month. However, I
do gain several things from the switch.

First, I get to abandon a proprietary Sass syntax (`$color-blue: #32c7ff;`) in favor of a
standards-backed format (`--color-blue: #32c7ff;`). I can actually write _CSS_ again, and not an
abstracted substitute. This is not only far more future-proof, but as CSS evolves, I’m taking
advantage of all the newest features (which also lets you do
[cool stuff like this](https://codepen.io/wesbos/pen/adQjoY/)).

Second—and this is beyond the scope of this post—by writing more modular CSS, I’m less limited in
how I load those styles, either directly from the browser
[or in JS](https://github.com/MicheleBertoli/css-in-js).

Third, PostCSS boasts some [really fast compile times](https://github.com/postcss/benchmark) (up to
36× faster than Ruby Sass). While this isn’t reason enough to use a technology, it sure is a nice
bonus once you’ve decided to switch.

CSS is undergoing a much subtler shakeup than JavaScript has been for the past year and a half. But
it’s still being shaken up, nonetheless, as the way we write markup and style is changing due to the
former.

# The setup

_Note: I’m using ExtractTextPlugin to save the CSS as a separate file; you can use
_`_style-loader_`_ instead if you’re loading CSS with JS._

## Command Line

Add webpack, css-loader, file-loader (we’re not using it directly, but it’s a dependency),
[PostCSS](https://github.com/postcss/postcss),
[postcss-loader](https://github.com/postcss/postcss-loader), [cssnext](http://cssnext.io/), and
[postcss-import](https://github.com/postcss/postcss-import). Run the following from your command
line:

```
yarn add --dev webpack extract-text-webpack-plugin css-loader file-loader postcss postcss-loader postcss-cssnext postcss-import
```

Also install webpack globally (`npm i -g webpack`) if you haven’t already—it’ll make compiling
simpler unless you
[set up NPM scripts](https://github.com/kriasoft/react-starter-kit/blob/master/docs/recipes/using-npm-and-webpack-as-a-build-tool.md).

## webpack.config.js

We’ll add something like this to `webpack.config.js` (JS config largely omitted):

```js
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './app.js';
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            'postcss-loader',
          ],
        }),
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
  },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css'),
  ],
  // …
};
```

Note that we’ve set `importLoaders: 1` on `css-loader`. We’re setting this because we want PostCSS
to git `@import` statements first
([longer explanation here](https://github.com/webpack-contrib/css-loader#importloaders)).

## postcss.config.js

This is just my personal preference: using a global `postcss.config.js` file in the project root.
Sure, you can configure this all in webpack, and some may find that more convenient. But I find this
method to be a little less hassle. Create a `postcss.config.js` file in your project root:

```js
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      browsers: ['last 2 versions', '&gt; 5%'],
    },
  },
};
```

Pay attention to how `postcss-import` comes _first._ **This is the difference between cssnext
working or not**. What this does is resolve `@import` statements in your CSS _first_, and then take
all your CSS in as one file and run all of it with cssnext. If you swapped the order, cssnext would
only process your entry file and none of your `@import`ed files would be autoprefixed/transpiled.

The `browsers` option is for [Autoprefixer](https://github.com/postcss/autoprefixer), which comes
built-in. If you haven’t used this, this prevents you from writing browser prefix-less CSS.
_This\_\_ is how your CSS should be_. If you know what a
`[browserslist](https://github.com/ai/browserslist)`[ file](https://github.com/ai/browserslist) is
and you’re using one already, you can actually use that instead of declaring that here.

# Developing

With the setup complete, we’ll start a file at `src/app.js`:

```js
import styles from './app.css';
```

And our `src/app.css` file can look something like this:

```css
/* Shared */
@import 'shared/colors.css';
@import 'shared/typography.css';
/* Components */
@import 'components/Article.css';
```

With cssnext, we can write stuff like:

```css
/* shared/colors.css */
:root {
  --color-black: rgb(0, 0, 0);
  --color-blue: #32c7ff;
}
/* shared/typography.css */
:root {
  --font-text: 'FF DIN', sans-serif;
  --font-weight: 300;
  --line-height: 1.5;
}
/* components/Article.css */
.article {
  font-size: 14px;
  & a {
    color: var(--color-blue);
  }
  & p {
    color: var(--color-black);
    font-family: var(--font-text);
    font-weight: var(--font-weight);
    line-height: var(--line-height);
  }
  @media (width > 600px) {
    max-width: 30em;
  }
}
```

And cssnext takes all of our variables, nested selectors, media queries, and all our other stuff
([read the docs](http://cssnext.io/features/) to see all it supports) and exports it out to a
`dist/assets/css.bundle.css` whenever we run `webpack` or `webpack -p`:

```css
.article {
  font-size: 14px;
}
.article a {
  color: #32c7ff;
}
.article p {
  color: rgb(0, 0, 0);
  font-family: 'FF DIN', sans-serif;
  font-weight: 300;
  line-height: 1.5;
}
> @media (min-width: 601px) {
  .article {
    max-width: 30em;
  }
}
```

And thanks to webpack, we still get all of the great module splitting and tree shaking.

# Kicking it Up a Notch

<figure><img src="https://miro.medium.com/max/46/1*FKF6BOG1Cr6WZtcAm_Bi7g.jpeg?q=20"><figcaption>🌶</figcaption></figure>

I had a more demanding use case where I needed to load my webfont stack with one CSS manifest
(separate from my other styles, for performance—similar to @zachleat’s
[Asynchronous Data URI font-loading method](https://www.zachleat.com/web/comprehensive-webfonts/#async-data-uri)
or Google Fonts, minus the subsetting & browser sniffing). The advantage of this is two-fold:

1. It reduces 5 webfont header requests into 1 CSS request, optimizing asset delivery
1. This project used a CDN, which means webfont files won’t load cross-domain anyway

My stylesheet lives in `./src/App.css`, and I declared all my `@font-face` rules in
`./src/Font.css`. This is what my `webpack.config.js` file looked like (_note I was also using
_`_url-loader_`_— _`_yarn add --dev url-loader_`):

```js
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractStyles = new ExtractTextPlugin('app.css');
const extractFonts = new ExtractTextPlugin('fonts.css');
module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './App.js',
  },
  module: {
    loaders: [
      {
        test: /App\.css/,
        use: extractStyles.extract({
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            'postcss-loader',
          ],
        }),
      },
      {
        test: /Font\.css/,
        use: extractFonts.extract({
          use: 'css-loader',
        }),
      },
      {
        test: /\.(woff|woff2)$/,
        use: ['url-loader'],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
    filename: '[name].bundle.js',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  plugins: [extractStyles, extractFonts],
};
```

My `./src/Font.css` file isn’t anything special, but just for clarity:

```css
@font-face {
  font-family: 'FF DIN';
  font-weight: 400;
  font-style: normal;
  src: url('./assets/ffdin-regular.woff');
}
/* … More fonts like this */
```

In my `./src/App.js` file, two lines connect the remaining dots:

```js
import styles from './App.css';
import fonts from './Font.css';
```

Now when I run `webpack -p` it will export 2 files (in addition to my JS):

- `./dist/assets/styles.css`
- `./dist/assets/fonts.css`

_Note: I specified my output filenames up at the top of the file with _`_const exportStyles_`_ and
_`_const _``_exportFonts_`_. They’**ll** go in the same folder as _`_output.path_`_, along with
your JS. No, it doesn’t make much sense to me, either, but there you have it._

This setup is rightfully confusing, and I’ll admit someone smarter than me can come up with a
smarter config—if, for example, I changed the name of `App.css` or `Font.css`, I’d have to update
this config, too.

But regardless, the most important thing to grasp is I have 2 separate `new ExtractTextPlugin`
instances—one for styling and one for fonts. **You need one **`**new ExtractTextPlugin**`** instance
for every separate CSS bundle you want.** If you tried to use the same instance for both, the plugin
would simply lump those both together.

Lastly, you can see I’m handling the base64 embedding of `.woff` and `.woff2` files with
`url-loader`. If I didn’t want to embed the file, I could use
`[file-loader](https://github.com/webpack/file-loader)` instead. I’m only loading those 2 formats
because it’s 2017, and that’s all you need for modern browsers now.

## Result

I’m extremely happy with the end result of this, because not only do I have my
[webfonts loading asynchronously](https://codepen.io/tigt/post/async-css-without-javascript), but my
CSS is also bundled separately. I get to have all the benefits of using webpack, but my app is also
progressive and still works just fine even if JavaScript is disabled on the client end.

# Caveats

cssnext isn’t a 1:1 replacement for Sass, so be sure to temper your expectations before committing
and diving in. Principally among the features missing are Sass’s powerful function and mixins
abilities. Plugins like [PreCSS](https://github.com/jonathantneal/precss) attempt to bridge the gaps
and allow Sass syntax in the PostCSS ecosystem. But PreCSS isn’t a perfect replacement, and there
may invariably be one or two things you need to modify with a Sass codebase to get it working.
