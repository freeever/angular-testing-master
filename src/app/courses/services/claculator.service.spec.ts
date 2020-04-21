import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';
describe('CalculatorService', () => {

  it("should add two numbers", () => {
    const logger = jasmine.createSpyObj("LoggerService", ["log"]);
    // spyOn(logger, 'log');
    const calculator = new CalculatorService(logger);
    const result = calculator.add(2, 2);
    expect(result).toBe(4);
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  it("should subtract two numbers", () => {
    const logger = jasmine.createSpyObj("LoggerService", ["log"]);
    const calculator = new CalculatorService(logger);
    const result = calculator.subtract(2, 2);
    expect(result).toBe(0, "unexpected subtract two numbers");
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

});
