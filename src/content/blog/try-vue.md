---
title: Learning javascript? try Vue
description: great for beginners, great for experts
pubDate: 2017-05-25
categories: ['dev']
---

<figure><img src="https://miro.medium.com/max/1400/1*2Z8gFBnlmFYo3hVOS1s2bw.gif"><figcaption>Behold! The Vue!</figcaption></figure>

> What JavaScript framework should I learn?What JavaScript framework should I learn?

…is the question I get asked most from beginners. It’s understandable, with currently 1_5 choices
\_of frameworks on the comparison site [TodoMVC.com.](http://todomvc.com/) Starting to learn a
framework is equal parts information overload and fear we’ll chose “wrong” and waste our time
because we didn’t know any better.

The truth is: _most_ of the knowledge you acquire in one JavaScript framework transfers to the
others. It’s not the same as picking which stock investment to purchase. If you, as a beginner,
never felt you got an adequate answer to the “which framework” question, it’s because **it’s not a
frequent question after learning that first framework**. Once you learn one, the second takes less
time. The same is true for the third, fourth, and fifth. Eventually they’re all tools in your
toolbelt. JavaScript frameworks aren’t different languages; they’re simply different approaches to
putting together the same thing: _JavaScript_.

I believe Vue is the best framework to _start_ with. It has the quickest ramp-up time (no webpack,
terminal commands, boilerplate, etc.) and a shorter time to mastery (thanks to
[well-written docs](https://vuejs.org/v2/guide/)). Vue is the quickest path to accomplishing having
that _first framework_ under your belt, and I see it as the best introduction into the world of
frameworks without it being a mere “stepping stone” or “shortcut.” Still need convincing?

- Unlike [jQuery](http://jquery.com/), Vue has predictable _state management_, so you can build big,
  complicated apps using Vue (“state management” means your data has a nice, clean, central place to
  live). jQuery is known to be a headache at scale because that’s not what it was designed for. And,
  curiously, Vue is actually _smaller in filesize_ (77.2k) than default jQuery (84.6k).
- Unlike [Ember](https://www.emberjs.com/), [Angular](https://angular.io), or
  [React](https://facebook.github.io/react/)/[Preact](https://preactjs.com/)/[Inferno](https://infernojs.org/),
  Vue is up and running in seconds. No bundlers, compilers,
  [webpacks](https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783),
  Typescripts, or terminal commands that are, at best, time sinks, and, at worst, incomprehensible.
  Configuration and tooling aren’t bad things, but to the beginner it can be a major headache. When
  you eventually find a need for all that high-powered stuff, Vue’s got you covered with hotness
  [like this PWA template](https://github.com/vuejs-templates/pwa).
- Also unlike
  [React](https://facebook.github.io/react/)/[Preact](https://preactjs.com/)/[Inferno](https://infernojs.org/),
  Vue.js is simple and straightforward. There’s a huge leap between learning beginner HTML and CSS
  to understanding the virtual DOM and JSX that most tutorials gloss over. Starting with Vue first
  and React second will make sense a whole lot quicker than vice-versa (for the record, I highly
  recommend learning React as your second framework).
- Vue is cutting-edge as of 2017, and growing rapidly, unlike older frameworks like
  [Backbone](http://backbonejs.org/) or [Knockout](http://knockoutjs.com/). You can learn Vue in
  confidence it won’t be phasing out next year.
- Unlike vanilla JS (no framework), Vue teaches good code habits. It forces you to think about your
  application in a healthy way (data-first). Further, frameworks are big time and money-savers for
  teams because every person is organizing code in a very similar pattern.

# OK, OK. Vue it is. But where do I start?

In this ’pen, you can see that you enter your name in a text `<input>` and it displays on a card.
Maybe this isn’t a _useful_ piece of UI that every site needs, but it’s a reduced example of a core
concept of JS frameworks: _data_.

## ⚛️ It all revolves around data

You may have heard “data” used all different ways: _big data_, _data-driven_, etc. For our purposes,
we’ll define data as **variable bits of information our application needs to handle. **Sometimes you
may also hear the words _state_ or _model_; all three words generally refer to the same thing
(sometimes _data_ refers more to database/API information while _state_ refers more to client-side,
in-memory changes, but I won’t get into those semantics here). When it comes to building your own
application, before you begin, it’s good to ask questions like:

1. What is the data in my application?
1. Do I need to mutate the data?
1. Where am I displaying data?
1. Does the data need to be stored somewhere (database, etc.)?

**1. What is the data in my application?** For our purposes, “data” is **everything the user does
that our website responds to**. Button clicks, text fields, checkboxes, mouse movements…if our site
should respond to it, it’s data we need to keep track of. In our example, we have one piece of
interactive data: that text field.

**2. Do I need to mutate my data?** Once a user enters their name, we’re not _mutating_ (altering)
that data. We’re keeping the user’s name exactly as they entered it, capitalization, spelling
errors, spaces, and all.

**3. Where am I displaying my data?** We’re displaying our data on our stylized name card, so that
data needs to go into the HTML somewhere.

**4. Does the data need to be stored anywhere?** We don’t need to worry about storing the data
anywhere; this is just for funsies.

Now that we have a better understanding of our data, Vue will start to make a lot more sense,
because now it’s time to build!

# 📛 Example 1: The Glorified Name Tag

Same example as above. First, we’ll get some markup on the page and load Vue. I’ll skip explaining
the CSS, but everything is in the CodePen if you want to take a look. Here’s our basic markup:

```html
<body>
  <div id="app" class="app">
    <input type="text" class="name-field" />
    <div class="name-tag">
      Hello, my name is
      <div class="name-show"><!-- name goes here --></div>
    </div>
  </div>
  <script src="https://unpkg.com/vue@2.3.3/dist/vue.min.js"></script>
  <script>
    new Vue();
  </script>
</body>
```

_Want to follow along looking at the entire code?
_[_Here’s the finished repo_](https://github.com/envylabs/learn-vue-js)_._

So we want to take that text field data, and display it where we have our `<!-- name goes here -->`
HTML comment. We start by invoking a `Vue()`
[**function**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
that initializes Vue and gets it ready for our app (when you see parentheses in JavaScript, that’s
how you know it’s a function). Ignore the `new` word in JavaScript for now. Vue needs that, and it’s
important, but it’s
[complicated to explain](https://github.com/getify/You-Dont-Know-JS/tree/master/this%20%26%20object%20prototypes)
at first.

This is technically working and correct, but it’s not doing much. We have to give Vue instructions
and data. Let’s pass one
[**parameter**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Parameters)
to our function in the form of an
[**object**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object):

```js
new Vue({ el: '#app' });
```

## Data types, according to JavaScript

Let’s take a short break to run through some common data types:

- [**String**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String):
  text values **surrounded by quotes**: `'Hey! I’m a text!'` or `'I ate three hotdogs today.'`.
- [**Number**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number):
  number values, **without quotes**:`42` or `3.14`. You can perform math on numbers: `42 * 2` or
  `3.14 + 1 — 2`.
- [**Object**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object):
  comma-separated key–value pairs, surrounded by **curly brackets**. You can place any property into
  an object value, like _string_, _number_, or even _object_ or
  _array_:`{ key1: 'some value', key2: 'some other value', key3: 3.14 }`. Objects are most useful
  when referencing **one thing at a time**.
- [**Array**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array):
  comma-separated value list, surrounded by **square brackets**. They’re basically objects without
  keys: `['some value', { stuff: thing }, 3.14]`. Arrays are most useful when referencing **the
  entire collection at once*.***\_ \_We’re not using Arrays in this post, but they’re mentioned
  because they’re frequently used alongside objects.

There won’t be a pop quiz on this stuff, and it’s OK if this doesn’t stick yet. For now, just think:
“I see quotes! That means ‘string’” or “I see curly brackets! That means ‘object.’”

Take a second look at `{ el: '#app' }`. Now you know that’s an _object_ (curly brackets), with a
_string_ (quotes) inside. Neat!

<figure><img src="https://miro.medium.com/max/60/1*AG1CpolTLjETiVTs1amFiQ.jpeg?q=20"><figcaption>In JavaScript, arrays are “special” objects. Functions are special objects, too. Objects are objects. Where does it end?</figcaption></figure>

Back to the code: [from the official docs](https://vuejs.org/v2/guide/), we learned to start Vue
with the following:

```js
new Vue({ el: '#app' });
```

We set `el:` (short for “container **el**ement”) to whatever the ID is for our containing element
(`#` means “ID,” the same as CSS). For that dynamic text field data, we need to give that an
identifier. How about “`name`?” That should be easy to remember.

```html
<body>
  <div id="app" class="app">
    <input type="text" class="name-field" />
    <div class="name-tag">
      Hello, my name is
      <div class="name-show">{{ name }}</div>
    </div>
  </div>
  <script src="https://unpkg.com/vue@2.3.3/dist/vue.min.js"></script>
  <script>
    new Vue({ el: '#app', data: { name: 'Timmy' } });
  </script>
</body>
```

We added 2 things:

1. We used 🐰🎩 _Vue magic_ and placed `{{ name }}` in our HTML where we want `name` to show (this
   is Vue, but the double curly brackets are actually a common syntax shared by React, Ember,
   Angular, and more to display data in HTML)
1. We gave Vue a `data` object (curly braces inside curly braces—object within an object!), and we
   declared a `name` value of `'Timmy'` (string). Remember: we decided what `name` was called, but
   `data` was something Vue told us about from [the docs](https://vuejs.org/v2/guide/). It might be
   confusing until you learn which parts are Vue’s by reading
   [the guides.](https://vuejs.org/v2/guide/)

<figure><img src="https://miro.medium.com/max/60/1*6mfXCjK65bU_Q_5qcdFRiQ.png?q=20"><figcaption>We made a thing 🎉! That’s not my name!</figcaption></figure>

If you save and load up that page in a web browser, you can see our name card showing `Timmy`! We’re
close, and our last step is connecting our input field to what we’ve done. One last addition will
complete it:

```html
<input type="text" class="name-field" v-model="name" />
```

By adding `v-model="name"` to our input, that tells Vue we want this input to _get_ and _set_ the
value for `name`. In other words, we want our Vue data to be _mutable_ by our text field. Typing
into that text field should update our data, and our data should update that text field. `v-model`
is another super-special Vue thing we only would know about if we
[read the docs](https://vuejs.org/v2/guide/#Handling-User-Input).

This is called a _two-way binding_ when something can both _get_ and _set_ data. We don’t have
anything else interacting with our `name` data, but if we did and that value changed in some other
part of the app, then the text input would update as well. Two-way binding.

If you’re still a little confused about `{{ name }}`, remember what I said earlier: _it’s all about
data_. When you use the double curly brackets in HTML, you’re asking Vue to display data on the
page.

<figure><img src="https://miro.medium.com/max/60/1*Rh5yfn-E-m_eWCQMns3O0A.png?q=20"><figcaption>Much better!</figcaption></figure>

👉 _To see the full code, check out
_[_Example 1 in the repo_](https://github.com/envylabs/learn-vue-js)_._

**Hint:** if you’re confused about what things should go inside `data`, try saving anything the user
interacts with—form fields, checkboxes, button clicks, etc. Need to keep track if a user checks a
checkbox? Throw a `v-model` on that checkbox and add it to `data`. If a user has opened a modal?
When a user clicks that button, save that open state in `data`
[with `on:click=""`](https://vuejs.org/v2/guide/events.html) (we won’t get into actions & methods in
this blog post, but
[_Composing Reusable Modal Dialogs in Vue.js _](https://adamwathan.me/2016/01/04/composing-reusable-modal-dialogs-with-vuejs/)is
a good one to bookmark). If a user does it, make a new data key! Over time, you’ll learn to identify
what you need to keep track of, and what you don’t.

## 🎯 **Extra challenge**

Try adding the `Hello, my name is` text into Vue’s `data` object, and displaying it on page with
double curly brackets.

# 🥋 Example 2: Computational Kung-fu

There’s a little more going on in the UI here, but we really only went from one piece of data to
two. Once again, we’re using `v-model` because we’re working with form fields. The inputs look like:

```html
<input v-model="username" type="text" autocapitalize="off" /> <input v-model="password" type="password" />
```

_Protip: use _`_autocapitalize="off"_`_ to be kind to your mobile users and prevent accidental
capitalization._

That’ll plug into our Vue app just as nicely, only this time let’s give ourselves some room to work
with line breaks:

```js
new Vue({
  el: '#app',
  data: {
    username: '',
    password: '',
  },
});
```

We set both to `''` (an empty string), because we expect those to be text. So we set Vue’s
expectations appropriately. We’re doing the same two-way binding from before, and we have access to
that data in Vue. But we’re going to do a little more than just _display_ what a user entered on
another part of the page. That was easy-peas; we’re shooting for the big leagues here. We want to
accomplish the following:

1. For `username`, we want to show “username taken” if a username is taken out of a list of names
1. For `password`, we want to show “weak password” if it’s too short, etc.

So that leaves the question: how do we give feedback _based_ on data, without _mutating_ the data?

## Making data interactive with Vue’s [**computed properties**](https://vuejs.org/v2/guide/computed.html)

<figure><img src="https://miro.medium.com/max/60/1*kqFmKyuPErUwOffTQLkv8A.jpeg?q=20"><figcaption>© Don Norman, the official baller of light switches</figcaption></figure>

The quickest explanation for how computed properties work might be a metaphor. Think of a
lightswitch in your house. That switch can have one of two values: `off` or `on`. That’s all the
switch itself does. Of course, that switch’s purpose is to control something else nearby. Usually
that’s a light bulb, but it could also be a fan, garbage disposal, or—like one particular switch
that was never fixed at my mother’s house—the power to an entire room. Whenever the position of that
switch changes, so does the behavior of whatever it’s wired to. If the switch is data, then its
lightbulb/fan/disposal is its _computed property, \_meaning it updates based on what the source data
(the switch) does_.\_

Let’s add a `computed` key to our Vue.js options object, and we’ll start with the first item above,
our `username` feedback. Let’s make up a name—`usernameTakenMessage`:

```diff
  new Vue({
    el: '#app',
    data: {
      username: '',
      password: '',
    },
+   computed: {
+     usernameTakenMessage: function () {
+       // something should go here…
+     },
+   },
  });
```

According to Vue’s references, computed properties must _always_ be a function, so we’ll just add an
empty one for now. Let’s make up a small list of fake usernames to check against: `bill`, `sally`,
`petunia`, and `gregory`. Let’s add those using JavaScript’s comparison operator (`===`) and the or
operator (`||`):

```diff
  new Vue({
    el: '#app',
    data: {
      username: '',
      password: '',
    },
    computed: {
      usernameTakenMessage: function () {
-       // something should go here…
+       if (this.username === 'bill' || this.username === 'sally' || this.username === 'petunia' || this.username === 'gregory') {
+         return 'Username taken';
+       } else {
+         return '';
+       }
      },
    },
  });
```

In our HTML, if we wanted to see `username`, we’d just write `{{ username }}`. But when we’re inside
`Vue()`, because of JavaScript reasons, we have to write `this.username`. `this` is a special word
in JavaScript. This is actually directly related to that `new` word, but again, that’s something you
can
[learn outside your blog post](https://github.com/getify/You-Dont-Know-JS/tree/master/this%20%26%20object%20prototypes)
when you’re ready to. For now, we’ll just remember it and move on.

Let’s walk through the key lines here:

- `usernameTakenMessage: function () {` we named our own key here, and used a name we wanted to.
  We’re setting it to a function because Vue demands it
- `if (this.username === 'bill' || this.username === 'sally' …` we’re using `if`, which starts
  [**a condition**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else).
  It means exactly what you think it does. `===` is used to compare if 2 things are equal. We’re
  saying “if `this.username` _equals_ `bill`” we want something to happen. We have these set between
  [**logical operator**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators)s
  (`||`) that mean “or.” In plain language, this whole line means: “if username is bill, or if
  username is sally, or if username is petunia, or if username is gregory, then (do something).”
- `return 'Username taken';` Hey! it’s our old friend, the string. `return` means stop executing the
  function at that point and report back with whatever value is listed. From the previous line,
  we’re saying “if the user entered any of these names, then we want `usernameTakenMessage` to give
  us the text `'Username taken'`.
- `else {` only works following an `if`. It basically catches whatever `if` didn’t. So this will
  _only_ execute if the user did _not_ enter “bill,” “sally,” “petunia,” or “gregory.”
- `return '';` We’re saying we want an empty string if the username is available

<figure><img src="https://miro.medium.com/max/2000/1*0ubbiOCxcFpQBwqd5NWW2A.png"><figcaption>So far, so good! Our “username taken” field is working, but it could still use styling and password strength.</figcaption></figure>

The rest of the program is simply closing curly brackets. Like objects, functions also use curly
brackets to demarcate where they begin and end. In case you were wondering, yes, it’s very confusing
when you have a lot of `}` together, and I frequently have one too many, or too few, and an error
happens. Welcome to being a programmer!

## Handling `password`

We’re now showing to the user whenever a username is taken, but we still need to display password
strength. Let’s make up some goals off the top of our head based on how we think it should work.

- Let’s give users a chance to start typing before we display anything. So if the `length` is `0`,
  we won’t show anything. Otherwise:
- 1–5 characters long: _weak_
- 6–9 characters long: _decent_
- 10+ characters: _strong_

Following that logic, let’s add another computed property, `passwordStrengthMessage`:

```js
new Vue({
  el: '#app',
  data: {
    username: '',
    password: '',
  },
  computed: {
    usernameTakenMessage: function () {
      if (this.username === 'bill' || this.username === 'sally' || this.username === 'petunia' || this.username === 'gregory') {
        return 'Username taken';
      } else {
        return '';
      }
    },
    passwordStrengthMessage: function () {
      if (this.password.length === 0) {
        return '';
      }
      if (this.password.length >= 1 && this.password.length <= 5) {
        return 'Weak';
      }
      if (this.password.length >= 6 && this.password.length <= 9) {
        return 'Decent';
      }
      if (this.password.length >= 10) {
        return 'Strong';
      }
    },
  },
});
```

- `passwordStrengthMessage: function () {` same as before, Vue computed properties have to be a
  function.
- `if (this.password.length === 0) {` For any string, you can put `.length` and it’ll return how
  many characters long it is (including spaces). Here, we’re comparing to a _number_, so we don’t
  need the quotes around `0`.
- `return '';` Let’s return an empty string if the password field is empty.
- `if (this.password.length >= 1 && this.password.length <= 5) {` The `<=` and `>=` mean “less than
  or equal to,” and “greater than or equal to.” The `=` always has to come last. We’re saying “if
  the password length is between 1 and 5 characters, (do something).” The `&&` means “and,” the
  counterpart to `||` (or). It’s always two ampersands and I’m not really sure why; it just do.
- `return 'Weak';` Show this message if password `length` is 1–5
- For the rest of the lines, they’re similar in nature—I’ll skip the explanation.

## Displaying the messages

Displaying these computed properties is as simple as it was in the first example: simply write
`{{ usernameTakenMessage }}` and `{{ passwordStrengthMessage }}` in your markup to display the
feedback:

```html
<input v-model="username" type="text" autocapitalize="off" />
<div class="feedback">{{ usernameTakenMessage }}</div>
<input v-model="password" type="password" />
<div class="feedback">{{ passwordStrengthMessage }}</div>
```

Now, if a user types a taken username, that `{{ usernameTakenMessage }}` will either be empty, or
`Username taken`. Likewise, the `{{ passwordStrengthMessage }}` will either show `Weak`, `Decent`,
or `Strong`.

We’re now giving the user proper feedback! Only, it’s still unstyled. To complete this project,
we’ll need to add or hide some error classes.

## Vue Class Binding

Adding or removing classes in Vue is called
[_class binding_](https://vuejs.org/v2/guide/class-and-style.html). If you’ve used jQuery, you may
have used `$().addClass()` or `$().removeClass()`. Vue does it a bit more automatically, and—you
guessed it—based on data. We specify a bound class with `v-bind:class=""` (`:class=""` for short).

Let’s say we want 2 state classes. If it’s valid, we’ll add `.is-valid`. If invalid, `.is-invalid`.
In Vue, we use an object to bind properties:
`{ 'value I want to show': computedPropertyThatControlsIt }`:

```html
<label :class="{ 'is-valid': true, 'is-invalid': false }"></label>
```

_Tip: in Vue, it’s not just _`_:class_`_ you can control; you can let Vue bind to any HTML
attribute, such as _`_:href_`_, _`_:src_`_, etc._

That will render `<label class="is-valid">`, always. We can make it a bit more responsive if instead
of `true` or `false` we hook that up to a new computed property:

```js
computed: {
  usernameIsValid: function () {
    if (this.username === 'bill' || this.username === 'sally' || this.username === 'petunia' || this.username === 'gregory') {
      return false;
    } else {
      return true;
    }
  },
```

You can see we copy & pasted a lot of our function code from `usernameTakenMessage`. Only this time
we’re returning `false` instead of `'Username taken'` and `true` instead of `''`. We can update our
markup now:

```html
<label :class="{ 'is-valid': usernameIsValid, 'is-invalid': false }>
```

That works! But we still need something for `false`. Fortunately, JavaScript has a solution to that:
`!`. The exclamation mark at the beginning of a reference means _opposite_ or _inverse_.
`!true === false`, and vice-versa. So, instead of making a whole _other_ computed property, let’s
save time and simply use:

```html
<label :class="{ 'is-valid': usernameIsValid, 'is-invalid': !usernameIsValid }"></label>
```

Amazing how much time a single `!` can save.

From this point, we are:

- Giving username feedback if username is taken
- Giving password feedback if password is too short
- Adding/removing styling classes based on user data

<figure><img src="https://miro.medium.com/max/2000/1*m2M2D5_--8-OjfgmMw5Vjw.png"><figcaption>Thanks to Vue, we can handle real-time user feedback with relatively little code and no jQuery “spaghetti”</figcaption></figure>

_But wait! \_you might be thinking (the 5 of you that read to this point). \_We haven’t built the
strength meter! Or the _`passwordIsValid` \_computed property! \_Rather than make this blog post
longer, I’ve given you the tools to inspect them yourself from the CodePen and the
[repo](https://github.com/envylabs/learn-vue-js). Much of that is re-using concepts and code we used
in the previous examples. But leave a comment if you’re still having trouble.

👉 _To see the finished product, check out
_[_Example 2 in the repo_](https://github.com/envylabs/learn-vue-js)_._

## 🎯 Extra challenge 1

We start out with a ✅ for `username`, and a magenta ✕ for `password`. This isn’t a great user
experience. Can we add more code to the `usernameIsValid` and `passwordIsValid` to return
`undefined` until a user has typed something in
([see the repo](https://github.com/envylabs/learn-vue-js) if you’re stuck—it’s not in the CodePen)?

## 🎯 Extra challenge 2

The `if`/`else` conditionals within `passwordStrengthMessage` was simplified for readability and
clarity, but we could write that more efficiently. For example, this accomplishes the same, with
less redundancy:

```js
passwordStrengthMessage: function () {
  if (this.password.length === 0) {
    return '';
  }
  else if (this.password.length < 6) {
    return 'Weak';
  }
  else if (this.password.length < 10) {
    return 'Decent';
  }
  else {
    return 'Strong';
  }
}
```

Are there any other ways you can shorten the `if`/ `else` rules further? _Note: this uses
_`_else if_`_, which can be tricky to use correctly at first. There’s no shame in sticking to
plain-old _`_if_`_/_`_else_`_ in the beginning._

# Help! Something’s not working!

<figure><img src="https://miro.medium.com/freeze/max/34/1*KZLmuC_pewVntxNWv7FY8w.gif?q=20"></figure>

You’ll naturally encounter errors when working with JavaScript, and so, Google Chrome’s console tab
will probably be open the entire time you work in JavaScript (right-click > Inspect > Console). It
sounds dumb, but _this is how JavaScript talks to you_. Everything that goes on gets placed here.
You can also use plugins like
[Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en)
for _even more_ feedback.

<figure><img src="https://miro.medium.com/max/60/1*9VNbK9yq8xacQ8kPdUHRrw.png?q=20"><figcaption>Hello, Console tab, my old friend</figcaption></figure>

If you get an error, and you’re not sure what it means, just do what us professionals do and Google
it. 99/100 times you’ll get a quick answer to your problem.

Yet another reason I love Vue is the error messages are very informative. Often times it’ll tell you
the exact line and character number your code errored at. Beyond
that,[ use ](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)`[console.log()](https://developer.mozilla.org/en-US/docs/Web/API/Console/log)`
like it’s going out of style, and it’ll also help to set up
[linters and debuggers](https://css-tricks.com/debugging-tips-tricks/). There are many tools you can
use, but the only wrong way to develop JavaScript is to **not use the Console tab**.

# Summary

So through this blog post, this is how much **JavaScript** you encountered:

- Strings: `'string'`
- Numbers: `42`
- Arrays: `[]`
- Objects: `{}`
- Functions: `function () { }`
- Conditionals:`if`/`else`
- Comparison operators: `===` (equals), `||` (or), and `&&` (and)
- Return: `return`
- The mysterious `this` and `new`

And you learned the following things about **Vue.js**:

- [Data](https://vuejs.org/v2/guide/#Getting-Started): `data: { name: '' }`
- Displaying data:`{{ name }}`
- [Computed Properties](https://vuejs.org/v2/guide/computed.html):
  `computed: { computed1: function() { } }`
- [Class binding](https://vuejs.org/v2/guide/class-and-style.html):
  `:class="{ 'is-valid': usernameIsValid }"`

That’s a pretty good base to build a lot of things! As your knowledge about JavaScript grows, you’ll
encounter crazy things like
[ternary operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator),
and you’ll fill in your knowledge gaps as you encounter code in the wild. But, arguably, through
this blog post you’ve already encountered most of what you’ll use on a regular basis in JavaScript,
and most of what I use in Vue.

The only critical Vue things I haven’t addressed yet are
[Event Binding](https://vuejs.org/v2/guide/events.html) and
[Methods](https://vuejs.org/v2/guide/events.html#Method-Event-Handlers).
[_Composing Reusable Modal Dialogs with Vue.js_](https://adamwathan.me/2016/01/04/composing-reusable-modal-dialogs-with-vuejs/)
is a good one to learn about `v-on:click` and the `methods: { }` object. And, of course, there’s
still a lot more to Vue like [list rendering](https://vuejs.org/v2/guide/list.html) and
[watchers](https://vuejs.org/v2/guide/computed.html#Watchers), but those usually become apparent
when you have a need for them.

Many blog posts end with encouragement to read something vast and boring like
[all the MDN pages](https://developer.mozilla.org/en-US/docs/Web/JavaScript). Rather than do that, I
believe the best way to learn about JavaScript is building things for yourself.

Don’t know what to build? Try doing a monthly challenge like
[the Daily UI Challenge](http://www.dailyui.co) but making it in code. Or
[search for “UI” on Dribbble](https://dribbble.com/search?q=ui) and recreate things there (give
credit to the original designer)! Or tackle that app idea you’ve been thinking about.
[Coding can be infinitely creative](http://codedoodl.es) if you don’t box yourself in. Or if you
want to brush up on your pure JavaScript chops, try
[the 30-day JavaScript challenge](https://javascript30.com/) by

<div class="by vx"><div><div class="by" role="tooltip" aria-hidden="false" aria-describedby="33" aria-labelledby="33">[Wes Bos](https://medium.com/u/86a55cd7983b?source=post_page-----ad27c7b6687f--------------------------------)</div></div></div>,
or even start to pick up your second framework, [React](http://reacttraining.com)!

With Vue.js under your belt, now the sky is the limit.

<figure><img src="https://miro.medium.com/max/730/1*NL0_nFYCPZfEdsXhAgALcw.gif"></figure>

# Further Reading

- [Intro to Vue.js Animations ](https://css-tricks.com/intro-to-vue-5-animations/)by
  <div class="by vx"><div><div class="by" role="tooltip" aria-hidden="false" aria-describedby="34" aria-labelledby="34">[Sarah Drasner](https://medium.com/u/c2509fce86ff?source=post_page-----ad27c7b6687f--------------------------------)</div></div></div>
- [A Vue.js Introduction for people that know just enough jQuery to get by](https://medium.freecodecamp.com/vue-js-introduction-for-people-who-know-just-enough-jquery-to-get-by-eab5aa193d77),
  by
  <div class="by vx"><div><div class="by" role="tooltip" aria-hidden="false" aria-describedby="35" aria-labelledby="35">[Matt Rothenberg](https://medium.com/u/2ed8b724390a?source=post_page-----ad27c7b6687f--------------------------------)</div></div></div>
- The official [Vue.js Guide](https://vuejs.org/v2/guide/)
- [Vue Awesome](https://github.com/vuejs/awesome-vue): the official collection of Vue.js plugins and
  addons
