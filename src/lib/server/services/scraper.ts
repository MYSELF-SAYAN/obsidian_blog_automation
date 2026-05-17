import * as cheerio from 'cheerio';
import axios from 'axios';
import { ScrapedContent } from '../types';
import logger from '../logger';

export async function scrapeBlog(url: string): Promise<ScrapedContent> {
  logger.scraper(`Fetching URL: ${url}`);

  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 30000
  });

  logger.scraper(`Response received, status: ${response.status}`);

  const $ = cheerio.load(response.data);

  const title = $('h1').first().text().trim() ||
    $('title').text().trim() ||
    'Untitled';

  $('script, style, nav, header, footer, aside, .sidebar, .comments, .advertisement').remove();

  const articleContent = $('article').html() ||
    $('.post-content').html() ||
    $('.article-content').html() ||
    $('main').html() ||
    $('[role="main"]').html() ||
    $('body').html() ||
    '';

  const content$ = cheerio.load(articleContent);
  const content = content$('body').text().trim();

  const publishedDate = $('time[datetime]').attr('datetime') ||
    $('meta[property="article:published_time"]').attr('content') ||
    undefined;

  const author = $('meta[name="author"]').attr('content') ||
    $('[rel="author"]').text().trim() ||
    $('.author').text().trim() ||
    undefined;

  logger.scraper(`Extracted content: title="${title}", contentLength=${content.length}`);

  return {
    title: title.replace(/\|/g, '-').trim(),
    content,
    url,
    publishedDate,
    author
  };
}
