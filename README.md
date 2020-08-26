# Motorcycle Service Database

![Build CI](https://github.com/ramblenride/motorcycle-service-db/workflows/Build%20CI/badge.svg)

A simple collection of files describing the service information for various motorcycles. The information for each motorcycle is stored in a simple JSON file. The format of that file is described in [moto-service.schema.json](moto-service.schema.json).

A JSON file that contains all the entries can be generated using Node.js:

```shell
> npm install
> npm run build
```

The generated file is compliant with the specification in [moto-service.schema.json](moto-service.schema.json).

More output formats will be supported in the future.

## License

![Licence Logo](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)
https://ramblenride.github.io/braap/
This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).

The short javascript code used to build the DB from the individual JSON files is licensed under MIT.

## Contributing

Thank you for your interest in contributing to this project!

Contributions are welcome. To submit the service information for a new motorcycle, or correct an existing one, please submit a pull request.

By contributing, you accept that the above license applies to your contribution.

## Projects using this database

* [Braap!](https://ramblenride.github.io/braap/) : Motorcycle Service Template Viewer and Editor
