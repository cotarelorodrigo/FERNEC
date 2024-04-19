from pymongo import MongoClient
from pymongo.results import InsertManyResult


class Configurable:
    def __init__(self, config: dict):
        for key in config:
            setattr(self, key, config[key])

    def get(self, attribute):
        return self.__getattribute__(attribute)


class MongoDBManager(Configurable):
    def __init__(self, kwargs: dict):
        super().__init__(kwargs)
        self.client = None

    def connect(self):
        self.client = MongoClient(self.get("uri"))

    def close(self):
        self.client.close()

    def __del__(self):
        self.client.close()

    def get_collection(self):
        db = self.client[self.get("database")]
        return db[self.get("collection")]

    @staticmethod
    def upload_many(collection, data: list, ordered=False) -> InsertManyResult:
        return collection.insert_many(data, ordered=ordered)

    @staticmethod
    def delete_partial_uploads(collection, processed_groups):
        delete_result = collection.delete_many({"video_name": {"$nin": processed_groups}})
        print("Número de documentos eliminados:", delete_result.deleted_count)
