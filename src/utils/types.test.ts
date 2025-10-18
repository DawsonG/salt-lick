import { describe, expect, it } from "vitest";
import { isNumber } from "./types";

describe('types', () => {
    describe('isNumber', () => {
        it('should determine whether a number or a string is a "valid" number', () => {
            expect(isNumber("5")).toBe(true);
            expect(isNumber(5)).toBe(true);
            expect(isNumber("4.5")).toBe(true);
            expect(isNumber("4.5.6")).toBe(false);
            expect(isNumber("no")).toBe(false);
            expect(isNumber(5.6)).toBe(true);
        });
    });
});