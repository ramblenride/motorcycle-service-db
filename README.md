# Motorcycle Service Database

![Motorcycle Service DB](logo/moto-service-db-small.png)

A simple collection of JSON files describing the service information for various motorcycles. The file format is described in [moto-service.schema.json](src/moto-service.schema.json).

A JSON file that contains all the entries can be generated using Node.js:

```shell
> npm install
> npm run build
```

The generated file is compliant with the specification in [moto-service.schema.json](src/moto-service.schema.json). An index file is also generated.

The output files are created in the `dist` directory.

## License

![Licence Logo](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)

This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).

The short javascript code used to build the DB from the individual JSON files is licensed under MIT.

## Contributing

Thank you for your interest in contributing to this project! Contributions are welcome.

By contributing, you accept that the above license applies to your contribution.

Please see the [CONTRIBUTING](CONTRIBUTING.md) file in this repository for more information on contributing.

## Projects using this database

- [Braap!](https://ramblenride.github.io/braap/) : Motorcycle Service Template Viewer and Editor
- [Moto Mecanico](https://github.com/ramblenride/moto-mecanico) : Mobile application for Motorcycle Maintenance
