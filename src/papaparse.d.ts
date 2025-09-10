declare module 'papaparse' {
  type ParseResult = {
    data: any[];
    errors: any[];
    meta: any;
  };

  type ParseConfig = {
    header?: boolean;
    skipEmptyLines?: boolean;
    complete?: (results: ParseResult) => void;
    error?: (error: any) => void;
  };

  const Papa: {
    parse: (file: File | string, config: ParseConfig) => void;
  };

  export default Papa;
}
