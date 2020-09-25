import requests, pytest

# with three lines / test cases:
# from - to
# 2000 - 3000
# 4000 - 2138
# 5000 - 3000

test_data_postcode = [
    (2000, 3000),
    (4000, 2138),
    (5000, 3000),
]

service_code = [
    ("AUS_PARCEL_EXPRESS", "Express Post"),
    ("AUS_PARCEL_REGULAR", "Parcel Post")
]


@pytest.mark.parametrize("fr, to", test_data_postcode)
def test_get_postage_domestic_services_status_code_within_AU(fr, to):
    domestic_url = "https://digitalapi.auspost.com.au/postage/parcel/domestic"
    auth = {"AUTH-KEY": "60c2ab35-bff5-4082-9184-a6f8ec713a81"}
    response = requests.get(f"{domestic_url}/service.json?from_postcode={fr}&to_postcode={to}&lenth=22&width=16&length=7.7&height=12&weight=1.5",
                            headers = auth)
    print(response.json()["services"]["service"][1])

    assert response.status_code == 200
    assert float(response.json()["services"]["service"][1]["price"]) > 0


@pytest.mark.parametrize("fr, to", test_data_postcode)
@pytest.mark.parametrize("service_code, service_name", service_code)
def test_get_postage_domestic_cost_within_AU(fr, to, service_code, service_name):
    domestic_url = "https://digitalapi.auspost.com.au/postage/parcel/domestic"
    auth = {"AUTH-KEY": "60c2ab35-bff5-4082-9184-a6f8ec713a81"}
    response = requests.get(f"{domestic_url}/calculate.json?from_postcode={fr}&to_postcode={to}&lenth=22&width=16&length=7.7&height=12&weight=1.5&service_code=" + service_code,
                            headers= auth)
    print(response.json())

    assert response.status_code == 200
    assert response.json()["postage_result"]["service"] == service_name
    assert float(response.json()["postage_result"]["total_cost"]) > 0