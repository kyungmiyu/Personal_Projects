// json 파싱을 위한 추상 클래스 정의
abstract class Storable {
    abstract getStorageKey(): string;
    abstract toJson(): string;
    abstract fromJson(json: string): Storable;

    saveToLocalStorage(): void {
        localStorage.setItem(this.getStorageKey(), this.toJson());
    }

    loadFromLocalStorage(): Storable | null {
        const json = localStorage.getItem(this.getStorageKey());
        if (json) {
            return this.fromJson(json);
        }
        return null;
    }

}
