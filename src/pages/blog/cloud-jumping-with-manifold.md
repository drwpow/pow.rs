---
title: 'Cloud-jumping: swap hosted services easily with Manifold'
description: how to take back full control of your cloud services in one afternoon
date: 2018-04-13
tags: ['dev']
layout: ../../layouts/post.astro
---

<figure><img src="https://miro.medium.com/max/2000/1*twYXJ0AvFBD_V4yNKhud_A.png"></figure>

Using some part of the cloud—whether AWS, Azure, Google Cloud, or others—has become a standard part
of modern web development. RightScale’s
[2018 State of the Cloud](http://www.rightscale.com/2018-cloud-report) reported **97% of
respondents** **using at least one cloud service.**

In most instances, it’s easiest to buy into one cloud ecosystem so you have fewer things to manage.
But when prices of a service increase, the platform changes, or you need to add an outside service
to the mix, how do you handle switching **one **service from your vendor-locked cloud, let alone
several?

[Manifold](https://www.manifold.co)’s **free developer tools** provide everything you need to
build-your-own cloud from existing providers. To see how, I’ll be taking an example application with
authentication, hosting, and account email services, and moving the app off AWS and onto independent
providers for all three parts.

# The App

<figure><img src="https://miro.medium.com/max/60/1*nRo2kUlkz1I7zK43KkdCCA.jpeg?q=20"><figcaption>A basic cloud app using AWS Elastic Beanstalk, RDS Postgres, and Simple Email</figcaption></figure>

Our [example app](https://github.com/manifoldco/manifold-sample-app) is nothing more than a login
with an authenticated page, and a password reset via email. So we’re using the following services:

- AWS Elastic Beanstalk (Node.js)
- AWS RDS Postgres
- AWS Simple Email

You can see the code for the starting application
[here, in the ](https://github.com/manifoldco/manifold-sample-app)`[master](https://github.com/manifoldco/manifold-sample-app)`[ branch](https://github.com/manifoldco/manifold-sample-app).

The credentials for the services are all fed in via environment variables through a `.env` file.
Though the values aren’t saved in the app, you can see all the variable names needed in the
`[.env.example](https://github.com/manifoldco/manifold-sample-app/blob/master/.env.example)`[ file](https://github.com/manifoldco/manifold-sample-app/blob/master/.env.example).

# Moving to Manifold

With [Manifold](https://www.manifold.co/), you can hook up any service you want—even those not
listed on the [Services page](https://www.manifold.co/services)! But for this example, our usecase
is satisfied by the existing services of [Mailgun](https://www.manifold.co/services/mailgun) and
[JawsDB Postgres](https://www.manifold.co/services/jawsdb-postgres), so we’ll use those two. But
again, once the application uses Manifold, those can be swapped out easily at any time.

To start, [sign up for a free manifold account](https://manifold.co) (only takes a few seconds if
you authenticate with GitHub). Then, from our project window, we’ll run the following:

**Mac (via **[**Homebrew**](https://brew.sh)**):**

```
brew install manifoldco/brew/manifold-cli
```

**Linux/Windows:**

```
curl -o- https://raw.githubusercontent.com/manifoldco/manifold-cli/master/install.sh | sh
```

_Note: you can read more about this install script on the
_[_Manifold CLI Guide_](https://docs.manifold.co/docs/install-77T6auwaaIQcgA4QGouO0)_._

Then, log in with `manifold oauth -- github` if you registered via GitHub, or `manifold login` if
you signed up with email / password. Now comes the fun part!

# Swapping RDS with JawsDB

<figure><img src="https://miro.medium.com/freeze/max/60/1*grs2mcpxe_p5PwuvpeCaLA.gif?q=20"><figcaption>Adding resources with `manifold create` couldn’t be easier. If you like what you see, we’ve released promptui as OSS!</figcaption></figure>

Run the following to add a resource, and the friendly CLI will walk you through provisioning (it
even gives you pricing and descriptions in-terminal!):

```
manifold create
```

For JawsDB, select`jawsdb` as the service type, and `kitefin` for the lowest-cost plan (you can
adjust the plan later from [the Dashboard](https://dashboard.manifold.co)).

Complete the remaining prompts like `region` and `name` with whatever you wish.

## Updating the creds

Our app is still using the RDS creds in `.env`, so we’ll need to update those. Those can easily be
grabbed from within the [Dashboard UI](https://dashboard.manifold.co), but we’ll stick to the CLI
for simplicity. Simply run:

```
manifold export
```

…and you’ll see the credentials exposed into your terminal session (if you need to output a project,
run `manifold export --project projectname`). We already have an `.env` already, but for future
reference, you can optionally specify an output file like so:

```
manifold export > .env
```

What you should see from JawsDB is all the credentials rolled into one URL:

```
JAWSDB_URL=postgres://$USER:$PASSWORD@$HOST:$PORT/$DATABASE
```

Pluck apart those values from the URL into `.env` to swap your app.

## Migrating the data

There’s no GUI for exporting your AWS Postgres database, but the standard
[pg_dump](https://www.postgresql.org/docs/current/static/app-pgdump.html) will work just fine.
Assuming your RDS instance is
[publicly accessible](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreatePostgreSQLInstance.html),
run:

```
pg_dump $AWS_DATABASE -h $AWS_HOST -U $AWS_USER -f development.dump
```

You’ll be prompted for your password so it’s not saved in your shell history. To output a
`development.dump` file from AWS. Then simply import into JawsDB:

```
psql $JAWS_DATABASE < development.dump -h $JAWS_HOST -U $JAWS_USER
```

You’ll likely see some errors like `ERROR: role does not exist` because of username differences, but
it should succeed nonetheless. You can verify by running
`psql $JAWS_DATABASE -h $JAWS_HOST -U $JAWS_USER` and `\dt` to show a list of tables. You can follow
up with a query to double-check the data made it (e.g.: `SELECT * from users;`).

# Swapping Simple Email (SES) with Mailgun

Migrating our database was about as easy as it gets, but not all service-swapping is quite as rosy.
To switch from Mailgun, we will have to modify app code a bit in addition to a simple `.env` update.

Add [Mailgun](https://www.manifold.co/services/mailgun) to your Manifold account, either through
running `manifold create` locally, or via the [Dashboard](https://dashboard.manifold.co). Their free
tier is perfect for testing.

Once you’ve added it, click the **Open Mailgun Dashboard** button at the top of the screen:

<figure><img src="https://miro.medium.com/max/60/1*8_GdwZWxefR7qfMC78s9Pw.png?q=20"><figcaption>You can jump to the Mailgun Dashboard straight from Manifold</figcaption></figure>

From there, you’ll want to **Add Custom Domain:**

<figure><img src="https://miro.medium.com/max/60/1*Uxzrw4TXAwRYwfdRedmLag.png?q=20"><figcaption>Adding a custom domain in Mailgun</figcaption></figure>

Follow the instructions that follow for adding Mailgun to your domain, which is necessary to avoid
spam filters and whatnot. Back in our app, we’ll swap `node-ses` with `mailgun-js`:

```
yarn remove node-ses<br>yarn add mailgun-js
```

Then in our email config, we’ll make a few changes that swap out the SES client with Mailgun’s (you
can see the diff on the
[Pull Request from the sample app](https://github.com/manifoldco/manifold-sample-app/pull/2)).
Overall, not too bad! The API, fortunately for us, ended up being similar. We only renamed two env
variables—so as to not be confusing later— and had to change `message` to `text` in our email call.

<figure><img src="https://miro.medium.com/max/2000/1*XP-f8SlyV-l6uFDJXnFtcg.png"><figcaption>https://github.com/manifoldco/manifold-sample-app/pull/2</figcaption></figure>

Once some test emails are sent, we’re pretty much in business!

# Swapping Hosting

Our app was originally hosted on Amazon Elastic Beanstalk, and moved to Zeit Now. I expected to
glean some insight from migrating hosts, but came up short—the process was unremarkably quick and
painless. The only lesson I learned is so glaringly obvious, it’s almost not even worth saying:

_If you use cloud services that work on any host, you can deploy to any host at any time._

\_“Duh,” \_you’d say. And you’re not wrong! But it’s not bad advice to keep in mind, either.

# 💁 Tip: Projects and Teams save a ton of headache

**Projects** are the best way to associate related resources together, especially if you’re using
several in the same application or suite of apps. You can create new projects with:

```
manifold projects create
```

Associate resources to that new project by running:

```
manifold projects add
```

The biggest advantage to projects, besides organization, is **one-click **`**.env**`** file
downloads.** Clicking either the “download .env” or “Show credentials” buttons will yield all values
for all resources in a project. Huge time-saver when it comes to updating access tokens!

## 🔐 Even more security

If you want to make it even more secure and load secrets from memory,
[try using ](https://docs.manifold.co/docs/cli-quickstart-6JMEw1CD6wguwIYymUuAQ6#run-your-project)`[manifold run](https://docs.manifold.co/docs/cli-quickstart-6JMEw1CD6wguwIYymUuAQ6#run-your-project)`
to start your app—you can inject env vars directly from Manifold without any of them living in your
file system! The sample app has an
[example of how to do this in ](https://github.com/manifoldco/manifold-sample-app/blob/manifold/package.json#L9)`[package.json](https://github.com/manifoldco/manifold-sample-app/blob/manifold/package.json#L9)`.

## 👯‍ Team projects

Team projects are even more useful. With team projects, you can invite and uninvite other developers
to access shared resources, and pay for it all with one set of billing info. To create a **team
project** (assuming you’ve created a team with `manifold team create`), first switch to a new team:

```
manifold switch
```

And then you can run `manifold projects create` from that new team context to create a project for
that team (currently, you can’t convert an individual project to a team project, but it’s not too
bad to move existing resources from an old project to a new one—you don’t have to start from scratch
again).

# Recap

Still debating how much effort it’d be to migrate cloud services for your app? Here are some good
and bad practices that should give some indication:

## Quick & easy migrations

1. Environment variables used for all credentials
1. Open-source technology powers most of the app
1. Configurations are all abstracted into a central place

## Painful migrations

1. Hard-coded credentials everywhere
1. “Blackboxed” or proprietary systems power most of the app
1. Configurations are written ad-hoc, wherever they’re needed

Migrations may not ever be _fun_, but with tools like Manifold’s CLI it can come pretty darn close.

The best migration may be none at all, but when the time inevitably comes, Manifold makes it as
painless as it possibly can be.

<figure><img src="https://miro.medium.com/max/2000/1*yjQxpcurS6C8nHXJST-7Zw.png"></figure>
