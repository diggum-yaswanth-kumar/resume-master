import asyncio

class MockCollection:
    def __init__(self, name):
        self.name = name
        self.data = []

    async def insert_one(self, doc):
        self.data.append(doc)
        return doc

    async def find_one(self, query):
        for doc in self.data:
            match = all(doc.get(k) == v for k, v in query.items())
            if match:
                return doc
        return None

    def find(self, query):
        class Cursor:
            def __init__(self, result):
                self.result = result
            def sort(self, key, direction):
                # Simple sort implementation (descending)
                self.result.sort(key=lambda x: x.get(key, 0) if isinstance(x.get(key), (int, float)) else str(x.get(key)), reverse=(direction == -1))
                return self
            async def to_list(self, length):
                return self.result[:length]
                
        results = []
        for doc in self.data:
            if all(doc.get(k) == v for k, v in query.items()):
                results.append(doc)
        return Cursor(results)

class MockDatabase:
    def __init__(self):
        self.collections = {}
        
    def __getitem__(self, name):
        if name not in self.collections:
            self.collections[name] = MockCollection(name)
        return self.collections[name]

db = MockDatabase()

def get_database():
    return db
