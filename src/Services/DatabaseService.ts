export interface StorableWithID {
    uuid: string;
}

export default class DatabaseService {
    public saveObject<T>(object: T, collectionName: string): void {
        let collection = JSON.parse(localStorage.getItem(collectionName) || "[]") as [T];
        collection.push(object);
        localStorage.setItem(collectionName, JSON.stringify(collection));
    }

    public getCollection<T>(collectionName: string): [T] {
        return JSON.parse(localStorage.getItem(collectionName) || "[]") as [T];
    }

    public getItemById<T extends StorableWithID>(collectionName: string, id: string): T | undefined {
        let collection = JSON.parse(localStorage.getItem(collectionName) || "[]") as [T];
        return collection.find(item => item.uuid === id);
    }

    public updateItemById<T extends StorableWithID>(collectionName: string, id: string, object: T): void {
        let collection = JSON.parse(localStorage.getItem(collectionName) || "[]") as [T];
        let item = collection.find(item => item.uuid === id);
        if(item === undefined)
            return;
        let index = collection.indexOf(item);
        collection[index] = object;
        localStorage.setItem(collectionName, JSON.stringify(collection));
    }
}