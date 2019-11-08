# Repos

## Description

Repository search is a simple web application built in Elixir and Phoenix that will:
* Take a user’s github username
* Return a list of repositories that user is watching with a link to each.
* And displays some other interesting info about that user, such as the count of the user's pull requests, issues, and more!

## Technical Notes

This project relies on [GitHub's V4 API](https://developer.github.com/v4/). It is built in Elixir using the Phoenix framework. Input from the user is communicated to Phoenix over Websockets, and the results of the query to GitHub is broadcasted to the user.

## Getting Started

To start Repository Search:
  * This project assumes you have installed [Elixir and Phoenix](https://hexdocs.pm/phoenix/installation.html).
  * Start by cloning this repository (`git clone https://github.com/fiveache/Repos.git`) and navigating into the directory.
  * Install dependencies with `mix deps.get`
  * Install Node.js dependencies with `npm install`
  * Generate a [GitHub Token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) with User and Repository read scopes.
  * remove the `.` from `config/.dev.secret.exs`
  * Replace `<API KEY FROM GITHUB>` with the token generated from the step above.
  * Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Using the Search

Enter a GitHub username into the search bar and hit `Search`. User data will appear.

## Some of the Resources Used to Complete This Project

  * Official Phoenix website: http://www.phoenixframework.org/
  * Phoenix Guides: http://phoenixframework.org/docs/overview
  * Phoenix Docs: https://hexdocs.pm/phoenix
  * Stephen Grider's Complete Elixir and Phoenix Bootcamp: https://www.udemy.com/share/101WuiB0AccFxaQHg=/
  * GenServer Tutorials: http://elixirbridge.org/04_Mix_Applications/16.5-genserver.html
  * GitHub's Schema Explorer: https://developer.github.com/v4/explorer/
  * Elixir Docs: https://elixir-lang.org/docs.html
  * The Little Elixir & OTP Guidebook: https://www.manning.com/books/the-little-elixir-and-otp-guidebook
  * Tracy Lum's Querying GitHub's GraphQL API: https://www.tracylum.com/blog/2017-09-09-querying-githubs-graphql-api/

## Screenshot
![Screenshot](https://github.com/fiveache/Repos/blob/master/docs/screenshot.png?raw=true)