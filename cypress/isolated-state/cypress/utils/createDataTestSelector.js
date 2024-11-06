export const createDataTestSelector = (dataTestId) => {
    if (dataTestId.includes(' ')) {
      throw new Error('[CreateDataTestSelector] dataTestId cannot contain spaces')
    }
  
    return `[data-testid="${dataTestId}"]`
  }
  