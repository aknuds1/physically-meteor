# -*- coding: utf-8 -*-
import json
import codecs


class JsonWithEncodingPipeline(object):
    def __init__(self):
        self.__items = []


    def process_item(self, item, spider):
        self.__items.append(dict(item))
        return item


    def close_spider(self, spider):
        with codecs.open('items.json', 'w', encoding='utf-8') as file:
            file.write(json.dumps(self.__items, ensure_ascii=False) + '\n')
