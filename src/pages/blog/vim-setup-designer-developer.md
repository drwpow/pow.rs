---
title: VIM setup for a designer/front-end dev on macOS
description: when you want to use vim but don’t want your eyes to bleed
date: 2016-09-22
tags: ['dev']
layout: ../../layouts/post.astro
---

_Updated for Oct 2017_

<figure><img src="https://miro.medium.com/max/1400/1*SlNauUKxZwr0GOc-2iDJzA.png"><figcaption>Oh My Zsh + iTerm + Vim: a lean, mean, coding machine</figcaption></figure>

Disclaimer: _I have no idea what I’m doing. Use at your own discretion._

So I’ve made the initial dive into Vim, and
[wanted to talk about it](https://twitter.com/iamdevloper/status/638662703796490240). Sure, there
are a ton of blog posts already about this, but I wanted to toss this setup in the ring for 3
reasons:

1. **This is current.** Tools and plugins not only become deprecated, but also superseded by
   something better/faster/leaner. As of October 2017, I’m using things in active development that
   are improvements on older tools from earlier this year and before.
1. **I don’t like clutter.** Reading other posts telling me to install _x_, _y_, and _z_ for my rig
   with no explanation, I’m always wondering: _but why?_ I don’t assume what’s right for me is right
   for you, but I do keep things light and simple. I also try to simplify configuration whenever
   possible—it’s not fun for me.
1. **I’m a designer.** I ❤️ pretty things. My tools need to be _fast_, but that doesn’t mean they
   should be _ugly_ too. I also need fuzzy finders, file trees, and other creature comforts Sublime
   & Atom users are used to. Fortunately, Vim has all that plus some.

_Note: this assumes you have _[_homebrew_](http://brew.sh/)_ installed._

# 1/3: Oh My Zsh

<figure><img src="https://miro.medium.com/max/1400/1*IvvK2NwDl4qv6G4c9rMk5Q.png"><figcaption>Oh My Zsh adds pretty Git-flavored prompts and catches spelling errors as I type</figcaption></figure>

## What is it?

At a certain point, trying to customize macOS’ Bash shell with cool stuff like
[powerline](https://github.com/powerline/powerline) can become a headache when you’re rebuilding
your tools to depend on Python and burning time font debugging. Not to mention it’s a time sink
hunting down all the random scripts and gists and throwing code willy-nilly into your
`~/.bash_profile` just to add one thing.

[**Z shell**](https://github.com/robbyrussell/oh-my-zsh) is a vast improvement over Bash, and you
can invisibly set your system to use it instead (including Terminal, iTerm, and everything else you
use). Add [Oh My Zsh](https://github.com/robbyrussell/oh-my-zsh), and you get the benefits of an
actively-developed shell with a rich feature set along with a community-driven plugin ecosystem: you
can tap into some powerful tools with no fuss. Unlike Bash, this was _designed_ to be customized,
and you’ll thank yourself later for switching. And fortunately, it’s easy to try Z shell as it isn’t
a system dependency. So even though it behaves like your system Bash does, you can cleanly remove it
at any time you wish.

## Install

To get started, run from your Terminal:

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

## Config

Open up and edit your `~/.zshrc` file to change settings (this is your new `~/.bash_profile`). This
is what mine looks like (with all the commented lines removed):

```
export ZSH=$HOME/.oh-my-zsh

# Theme
ZSH_THEME="agnoster"

# Plugins
plugins=(brew git node osx postgres rbenv z zsh-syntax-highlighting)
source $ZSH/oh-my-zsh.sh
```

You can set the **theme** of your Terminal here with `ZSH_THEME="themename"` with one of the
[packaged themes](https://github.com/robbyrussell/oh-my-zsh/wiki/Themes). You can also
[install your own](https://github.com/robbyrussell/oh-my-zsh/wiki/External-themes).

As you can see, I have Homebrew, Git, Node,
[OSX](https://github.com/robbyrussell/oh-my-zsh/tree/master/plugins/osx), Postgres, Rbenv, and
[Z](https://github.com/robbyrussell/oh-my-zsh/tree/master/plugins/z)
[plugins](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins) installed. These help me out in
auto-completing commands I type. The
[OSX](https://github.com/robbyrussell/oh-my-zsh/tree/master/plugins/osx) plugin can open new Finder
windows from my command-line, something not easily done from Bash.
[Z](https://github.com/robbyrussell/oh-my-zsh/tree/master/plugins/z) is “the new Autojump,” as they
put it, and I can type any part of a folder name like `z proj` to jump to
` ~/sites/my-``**proj**``ect ` in my command-line from anywhere. And that’s just scratching the
surface with plugins.

Last thing of note is the
[Zsh Syntax Highlighting plugin](https://github.com/zsh-users/zsh-syntax-highlighting). That’s the
spellchecker one that tells you if you’ve mis-typed a word, and it’s really powerful.

There’s a lot more to delve into, but the important thing of note is: your `~/.bash_profile` file
would either be hundreds of lines long at this point, or split up into multiple folders to have the
same functionality baked into just a few lines of `~/.zshrc` with Oh My Zsh.
[_Read more about Oh My Zsh_](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins).

# 2/3: iTerm

<figure><img src="https://miro.medium.com/max/60/1*fC7FF6bSxPhayICD4B2zYQ.png?q=20"><figcaption>Split panes: as good as it gets</figcaption></figure>

## What is it?

[iTerm](https://www.iterm2.com/) is something that I didn’t really need until my switch to Vim. But
now I need it for one reason and one reason only: _split panes_. I can run my Rails server, Gulp
tasks, optimize images with [TinyPNG](https://www.npmjs.com/package/tinypng-cli) and
[SVGO](https://github.com/svg/svgo), and have full command line access while I edit source code _all
in the same window_. It saves me from having to switch back-and-forth between my editor and Terminal
like I used to. So if you need to do anything in the command line while editing code—which is, like,
all the time—you can either use iTerm or manage multiple tabs and windows for each project you have
open. In essence, you get a cleaner, more efficient workspace that’s just not possible with Terminal
alone.

_Update: split panes are what _[_tmux_](http://fideloper.com/mac-vim-tmux)_ is for. I’m still in the
process of learning it and don’t use it all the time. But a 24-bit color editor like iTerm is
mandatory for me regardless, which means Terminal is out either way._

As a bonus, a few of Oh My Zsh’s plugins take advantage of iTerm’s features and aren’t accessible in
Terminal, so you get to claim some extra functionality.

## Install

Just go to the [iTerm website](https://www.iterm2.com/) to download and install.

## Config

iTerm is pretty light on configuration, but you can find some
[pretty good themes](http://iterm2colorschemes.com/) for it.

It is useful to note the `⌘ + D` and `⌘ + Shift + D` shortcuts to split the current view
horizontally or vertically. `⌘ + Alt + Arrows` moves between splits.

# 3/3: vim-plug + Vim

<figure><img src="https://miro.medium.com/max/60/1*kGebCx6El-tRu9p8YWmZDA.png?q=20"><figcaption>Command line + code editor + file tree, all in one. What more could you want?</figcaption></figure>

## What is it?

Vim is the reason you’re reading this, and we’ll get to that in a sec.
[vim-plug](https://github.com/junegunn/vim-plug) is one of the several Vim package managers that
make your life easier when working with Vim: it’s how you can have all your fancy fuzzy finders,
file trees, and coding tools without drowning in Vimscript. I prefer vim-plug to
[Pathogen](https://github.com/tpope/vim-pathogen) because it handles updates more easily, and it’s
updated and actively maintained [unlike Vundle](https://github.com/VundleVim/Vundle.vim/issues/608).
From there you can configure your `~/.vimrc` file to taste.

## vim-plug

First, you might want to install shiny new Vim 8.x instead of the old, stinky Vim that comes on your
system:

```
brew install vim
```

It’s worth noting that `vi` will open the old 7.x version, but `vim` will open the new one installed
by Homebrew (you can add an
[alias](http://www.cyberciti.biz/tips/bash-aliases-mac-centos-linux-unix.html) for `vi` into
`~/.zshrc` if desired).

Next, install vim-plug with a Terminal command as specified in the
[repo](https://github.com/junegunn/vim-plug) (view instructions for:
[Mac](https://github.com/junegunn/vim-plug#unix)/[Unix](https://github.com/junegunn/vim-plug#unix)/[Windows](https://github.com/junegunn/vim-plug#windows-powershell)).

Then paste the following into `~/.vimrc` (create this file in your home directory if it doesn’t
exist already):

```
call plug#begin('~/.vim/plugged')

" Vim Plug
call plug#begin('~/.vim/plugged')

" Airline
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

" CtrlP
Plug 'ctrlpvim/ctrlp.vim', { 'on': 'CtrlP' }

" Color Schemes
Plug 'flazz/vim-colorschemes'

" NERD Commenter
Plug 'scrooloose/nerdcommenter'

" vim-ripgrep
Plug 'jremmen/vim-ripgrep'

" Surround
Plug 'tpope/vim-surround'

" Syntastic
Plug 'vim-syntastic/syntastic'

call plug#end()

" Initialize plugin system
call plug#end()
```

Listed are some of my favorite plugins:

- [CtrlP](https://github.com/ctrlpvim/ctrlp.vim): fuzzy-finder
- [NERDTree](https://github.com/scrooloose/nerdtree): file tree for Vim
- [NERDCommenter](https://github.com/scrooloose/nerdcommenter): easy comment toggling for most
  languages
- [surround.vim](https://github.com/tpope/vim-surround): handy shortcuts for surrounding lines,
  words, or blocks with HTML tags (`<p>`) or characters (`“`).
- [Syntastic](https://github.com/vim-syntastic/syntastic): next-generation Vim syntax highlighting
  and error checking for Babel, JSX, Ruby, or whatever you’re into.
- [Airline](https://github.com/vim-airline/vim-airline): powerful Vim theme based on Powerline.
  Absolutely essential for seeing what mode of Vim you’re in.

You’ll notice that **these aren’t installed yet**. Once your file is saved (`:w`), run the following
with Vim still open:

```
:PlugInstall
```

This will install all your plugins listed. Need to update? Try running `:PlugUpdate`. Need to remove
plugins? Remove the lines above, and run `:PlugClean`.

The sky is the limit, though! There are countless Vim plugins to choose from, and VimPlug takes all
the pain out of managing them.

## ripgrep

Last thing we’ll install is [ripgrep](https://github.com/BurntSushi/ripgrep). This is, from what I
could find, the fastest search tool available. It’ll make your fuzzy finder faster than anything
you’ve ever used before, and it can tap into some powerful code searching tools (such as hitting
[one keystroke to see all other instances of a reference](https://robots.thoughtbot.com/faster-grepping-in-vim)
almost instantly). To install, run the following from a Terminal:

```
brew install ripgrep
```

## CtrlP

If you chose to install CtrlP for fuzzy-finding (highly recommended), I recommend the following
setup by adding the following lines to your `~/.vimrc` file:

```
" Packages
if executable('rg')
  set grepprg=rg\ --color=never
  let g:ctrlp_user_command = 'rg %s --files --color=never --glob ""'
  let g:ctrlp_use_caching = 0
endif
let g:ctrlp_custom_ignore = {
   \ 'dir': '\.git$\|\.yardoc\|bower_components|node_modules|public$|log\|tmp$',
   \ 'file': '\.so$\|\.dat$|\.DS_Store$'
   \ }

" Key Commands
map <C-\> :NERDTreeToggle<CR>
```

What this does is hooks up **CtrlP** to ripgrep for crazy fast searching (just hit—you guessed
it—`Ctrl + P` to access your fuzzy finder). You can also edit the list of files/folders you don’t
want CtrlP to find with `ctrlp_custom_ignore` (I added the`bower_components/` and `node_modules/`
directories to my ignore list).

When browsing with CtrlP, simply hitting `Enter` will open the file in the same split, but you can
open it in a new horizontal or vertical split by pressing `Ctrl + x` or `Ctrl + v`, respectively.

I also added a shortcut for NERDTree to open the file tree from any window with `Ctrl + \`. You can
similarly close the tree with the same command.

_See the rest of my _`_~/.vimrc_`_ file
_[_on GitHub_](https://github.com/dangodev/config/blob/master/.vimrc)_._

# New Workflow

My current workflow when working on a Rails project:

```
z proj
-> ~/sites/my-project
rails s
```

Starts my rails server. I then hit `⌘ + Shift + D` to open a new split above and open Vim with:

```
vim
```

From there, I’ll hit

```
Ctrl + p
```

to look for the file I want inside my project directory, and open it by hitting `Enter`. If I want
to load another file side-by-side, I’ll open the file with

```
Ctrl + p<br>Ctrl + v
```

I can then hit

```
Ctrl + w + Arrows
```

to move between the Vim splits, or

```
⌘ + Alt + Arrows
```

to move to the command line below. I can now navigate through my code without touching my mouse. If
I need to find something in the current file, I’ll hit

```
/
```

and then enter a search phrase (`n`/`N` go forward/backward, respectively, through the highlighted
results). Or if I need to search my entire project for something, I’ll type

```
:Rg searchforthing
```

in normal Vim mode, and all instances of that phrase will appear in the window (you can also
[set up a keystroke to search for any word under your cursor](https://robots.thoughtbot.com/faster-grepping-in-vim)).

In the end, I’m still using Vim and it behaves a lot differently than Sublime and Atom (I’m still
getting used to the whole normal/insert/visual mode thing). But with the plugins and tools described
above, it’s a much friendlier form of Vim I’m jumping into, and with a little patience and an open
attitude, I’m learning new ways that I can start writing code more efficiently.

My ultimate end goal with all of this is to spend less time writing code, and more time shipping
finished products.
