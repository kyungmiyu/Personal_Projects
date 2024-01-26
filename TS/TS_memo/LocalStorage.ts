// LocalStorage에서 가져온 데이터 저장소 만들기
class LocalStorage extends Storable {
    private index: number;
    private subject: string;
    private content: string;

    constructor(index: number, subject: string, content: string) {
        super();
        this.index = index;
        this.subject = subject;
        this.content = content;
    }

    getStorageKey(): string {
        return 'data';
    }
    
    toJson(): string {
        return JSON.stringify({
            index: this.index,
            subject: this.subject,
            content: this.content
        });
    }

    fromJson(json: string): LocalStorage {
        const data = JSON.parse(json);
        return new LocalStorage(data.index, data.subject, data.content);
    }

}