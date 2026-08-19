import requests
from langchain_core.tools import tool


@tool
def convert_currency(amount: float, from_currency: str = "USD", to_currency: str = "EUR") -> str:
    """
    Converts a monetary amount between currencies using live foreign exchange rates.
    Use this tool when users specify budgets, prices, or expenses and need to know the equivalent amount
    in their destination country's local currency (or back to USD).

    Args:
        amount: The numerical amount of money to convert (e.g., 500, 1000.50).
        from_currency: 3-letter ISO currency code to convert FROM (default: 'USD'). Examples: USD, EUR, GBP, JPY, CAD, AUD, INR, THB, MXN, CHF.
        to_currency: 3-letter ISO currency code to convert TO. Examples: EUR (Europe/France/Italy/Germany/Spain), JPY (Japan), GBP (UK), THB (Thailand), MXN (Mexico).

    Returns:
        A human-readable string containing the converted amount and exchange rate, or a descriptive error message if inputs are invalid.
    """
    try:
        amount_val = float(amount)
    except (ValueError, TypeError):
        return f"Invalid amount '{amount}'. Please provide a valid numerical amount."

    if amount_val < 0:
        return f"Amount cannot be negative ({amount_val}). Please provide a positive amount."

    if not from_currency or not str(from_currency).strip():
        return "Source currency (from_currency) was not provided."

    if not to_currency or not str(to_currency).strip():
        return "Target currency (to_currency) was not provided."

    from_curr = str(from_currency).upper().strip()
    to_curr = str(to_currency).upper().strip()

    if len(from_curr) != 3 or not from_curr.isalpha():
        return f"'{from_currency}' is an invalid currency code. Please provide a standard 3-letter ISO currency code (e.g., 'USD', 'EUR', 'JPY', 'GBP')."

    if len(to_curr) != 3 or not to_curr.isalpha():
        return f"'{to_currency}' is an invalid currency code. Please provide a standard 3-letter ISO currency code (e.g., 'USD', 'EUR', 'JPY', 'GBP')."

    if from_curr == to_curr:
        return f"{amount_val:,.2f} {from_curr} is equal to {amount_val:,.2f} {to_curr} (same currency)."

    try:
        url = f"https://open.er-api.com/v6/latest/{from_curr}"
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            return f"Failed to fetch exchange rates (HTTP status {response.status_code})."

        data = response.json()
        
        if data.get("result") != "success":
            return f"Currency '{from_curr}' is not supported or rates could not be retrieved."

        rates = data.get("rates", {})
        if to_curr not in rates:
            return f"Currency code '{to_curr}' was not found in active exchange rates."

        rate = rates[to_curr]
        converted_amount = amount_val * rate

        return (
            f"{amount_val:,.2f} {from_curr} = {converted_amount:,.2f} {to_curr} "
            f"(Exchange Rate: 1 {from_curr} = {rate:,.4f} {to_curr})"
        )

    except requests.exceptions.RequestException as e:
        return f"Network error retrieving exchange rate: {str(e)}"
    except Exception as e:
        return f"Error performing currency conversion: {str(e)}"
