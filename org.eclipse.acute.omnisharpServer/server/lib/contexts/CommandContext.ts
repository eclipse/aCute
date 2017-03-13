export class CommandContext<T> {
    public constructor(public command: string, public value: T) { }
}
