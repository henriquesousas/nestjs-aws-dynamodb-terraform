import { Result } from './result';

export interface UseCase<I, O> {
  execute(input: I): Promise<Result<O>>;
}

export interface UseCaseWithNoInput<O> {
  execute(): Promise<Result<O>>;
}
