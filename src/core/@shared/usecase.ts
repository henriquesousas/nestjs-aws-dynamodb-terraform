import { Result } from './result';

export interface UseCase<I, O> {
  execute(input: I): Promise<Result<O>>;
}
