---
title: how to optimize images for web
description: not all optimization techniques are equal
date: 2016-06-03
tags: ['dev']
layout: ../../layouts/post.astro
---

<figure><img src="https://miro.medium.com/max/1400/1*-NIO56PqC98E1k9ruqQ5Kw.jpeg"></figure>

I don’t consider myself a Rails developer (yet), but with help from some brilliant coworkers at
Envy, I managed to pull off developing/designing
[Mama’s Sauce’s 3rd version of their website](http://mamas-sauce.com) and their first foray into
Rails.

I’ve written about
[image optimization before](http://madewithenvy.com/ecosystem/articles/2014/image-optimization/),
and it’s something I still put into practice as a front-end dev: making sites as compact as they can
be. Across the US, there are so many areas that don’t have broadband/fiber that exists in the
offices of web developers. It’s something developers too easily forget, and the results are bloated,
fancy websites that swaths of the world can’t use. You can take care of the bulk of site bloat with
simple image optimization; if you get that right, most of your job is done.

For Mama’s Sauce, images _are_ their business. Specifically, if photos of their print work look bad,
_they_ look bad. I was tasked with keeping their photos crisp, while keeping loading times low. The
secret is [**carrierwave-imageoptimizer**](https://github.com/jtescher/carrierwave-imageoptimizer) +
[**mini_magick**](https://github.com/minimagick/minimagick) + a JPG optimization trick: **high
resolution, low quality.**

The uploader, using CarrierWave, looks a little something like this:

```rb
class ImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick
  include CarrierWave::ImageOptimizer  def is_raster?(new_file)
    ext = new_file.extension.to_s
    ext.include?(‘jpg’) || ext.include?(‘png’)
  end  # Create different versions of your uploaded files:
  version :small, if: :is_raster? do
    process resize_to_fit: [960, 960]
    process optimize: [{ quality: 75 }]
  end
  version :medium, if: :is_raster? do
    process resize_to_fit: [2048, 2048]
    process optimize: [{ quality: 50 }]
  end
  version :large, if: :is_raster? do
    process resize_to_fit: [4096, 4096]
    process optimize: [{ quality: 50 }]
  endend
```

You can see I’m setting the JPG quality to 50%, but I’m not downsizing the resolution at all (the
large version is what gets progressively loaded using
[srcset](https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/)). The
on-screen downsizing mysteriously kills all the artifacting. The smaller version gets 75% because at
smaller resolutions, you can really notice 50% compression.

<figure><img src="https://miro.medium.com/max/60/1*xXCEeIYyVycM6VkNwCfJRA.jpeg?q=20"></figure>

The result? Images that look every bit as good as the original (provided you’re displaying on-screen
at 50% or smaller), but **< 20% the original weight**. The compression’s _there_, but you’d never
know it. And you can view Mama’s Sauce’s beautiful print work at breakneck speed, even on mobile.
