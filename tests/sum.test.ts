import { test, expect, describe } from "@jest/globals";
import sum from "./sum";


describe('sum module', () => {
    test('add 1+2 to equal 3', () => {
        expect(sum(1, 2)).toBe(4);
    });
});
