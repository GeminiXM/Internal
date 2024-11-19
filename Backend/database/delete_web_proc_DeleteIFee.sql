-- Execute the stored procedure directly in Informix
EXECUTE PROCEDURE web_proc_DeleteIFee(
    parDescription,
    parEndDate,
    parPrice,
    parEnteredBy
);
