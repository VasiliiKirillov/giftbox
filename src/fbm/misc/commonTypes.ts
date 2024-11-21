export type BaseError = {
  response: {
    status: string;
    data: {
      detail: string;
    };
  };
};
