# -*- coding: utf-8 -*-
import scrapy


class NimiSpider(scrapy.Spider):
    name = "nimi"
    start_urls = (
        'http://www2.staminagroup.no/nimi/om-oss/vare-behandlere/',
    )

    def parse(self, response):
        def parse_therapist(response):
            self.logger.info('Parsing therapist')
            main_content = response.xpath(
                '//*[contains(concat(" ", normalize-space(@class), " "), " mainContent ")]')
            name = main_content.xpath('h2/text()').extract_first()
            img = main_content.xpath('h2/img/@src').extract_first()
            summary = main_content.xpath('h4[1]/text()').extract_first()
            phone = main_content.xpath('h4[2]/text()').extract_first()
            email = main_content.xpath('h4[2]/a/text()').extract_first()
            description = main_content.xpath('p[3]/text()').extract_first()

            if name is None or img is None or summary is None or phone is None or description \
                    is None:
                self.logger.warning('Ignoring therapist due to missing metadata, response: {}'
                    .format(response))
                yield None
            else:
                areas = []
                for areas_sel in main_content.css('.collectionBoxItem'):
                    if areas_sel.css('h2::text').extract_first() == u'Problemområder':
                        self.logger.info('Parsing problem areas')
                        for area in areas_sel.css('li a::text').extract():
                            area = area.replace(',', ' ').replace(' og ', ' ')
                            sub_areas = [a.strip().capitalize() for a in area.split(' ') if
                                a.strip()]
                            areas.extend(sub_areas)

                data = {
                    'name': name,
                    'img': img,
                    'summary': summary,
                    'description': description,
                    'email': email,
                    'phone': phone,
                    'areas': sorted(areas),
                }
                self.logger.info('Got data: {}'.format(data))
                yield data

        self.logger.info('Parsing')
        for collection in response.css('.collectionBoxItem'):
            text = collection.css('h2 > a::text').extract()[0].encode('utf-8')
            if text in ['Fysioterapeuter', 'Manuellterapeuter']:
                self.logger.info('Collection text: {}'.format(text))
                for url in collection.xpath('ul/li/a/@href').extract():
                    abs_url = response.urljoin(url)
                    self.logger.info('Scraping therapist at {}'.format(abs_url))
                    yield scrapy.Request(abs_url, parse_therapist)
