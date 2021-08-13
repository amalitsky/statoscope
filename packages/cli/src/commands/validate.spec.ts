import os from 'os';
import path from 'path';
import yargs from 'yargs';
import validate from './validate';

const validatorFixturesJoraQuery = [
  '../../../../test/fixtures/cli/validate/ok.jora',
  '../../../../test/fixtures/cli/validate/fail.jora',
  '../../../../test/fixtures/cli/validate/rules.jora',
].map((filename) => ({
  name: path.basename(filename),
  path: path.resolve(__dirname, filename),
}));

const validatorFixturesJSJoraQuery = [
  '../../../../test/fixtures/cli/validate/jora-ok.js',
  '../../../../test/fixtures/cli/validate/jora-fail.js',
].map((filename) => ({
  name: path.basename(filename),
  path: path.resolve(__dirname, filename),
}));

const inputFixturePath = path.resolve(
  __dirname,
  '../../../../test/bundles/simple/stats-dev.json'
);
const rootPath = path.resolve(__dirname, '../../../../');
const outputDir = path.join(rootPath, 'test/temp', path.relative(rootPath, __filename));
// const consoleLog = console.log.bind(console);
const output: string[][] = [];
let consoleLogSpy: jest.SpyInstance<void, string[]> | null = null;

beforeEach(() => {
  consoleLogSpy = jest
    .spyOn(global.console, 'log')
    .mockImplementation((...args: string[]) => {
      output.push(
        args.map((o) =>
          String(o).replace(process.cwd(), '<pwd>').replace(os.tmpdir(), '<tmp>')
        )
      );
    });
});

afterEach(() => {
  consoleLogSpy?.mockRestore();
  output.length = 0;
});

function getOutput(): string[][] {
  return output;
}

describe('validator types', () => {
  test.each(validatorFixturesJoraQuery)('raw jora-query $name', async (item) => {
    const outputPath = path.join(outputDir, `raw jora-query ${item.name}.html`);
    let y = yargs([
      'validate',
      '--validator',
      item.path,
      '--input',
      inputFixturePath,
      '--output',
      outputPath,
    ]);

    y = validate(y);
    y.fail((_, error) => {
      console.error(error);
    });

    await y.argv;

    expect(getOutput()).toMatchSnapshot();
  });

  test.each(validatorFixturesJSJoraQuery)('jora-query from js $name', async (item) => {
    const outputPath = path.join(outputDir, `jora-query from js ${item.name}.html`);
    let y = yargs([
      'validate',
      '--validator',
      item.path,
      '--input',
      inputFixturePath,
      '--output',
      outputPath,
    ]);

    y = validate(y);
    y.fail((_, error) => {
      console.error(error);
    });

    await y.argv;

    expect(getOutput()).toMatchSnapshot();
  });
});
