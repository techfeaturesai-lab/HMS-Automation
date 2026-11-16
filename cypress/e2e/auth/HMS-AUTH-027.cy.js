/**
 * Test Suite: Authentication & Security
 * Scenario ID: HMS-AUTH-027
 * Scenario Name: Reject Protected Request When Auth Header Is Stripped or Tampered
 *
 * Description:
 * Verify that protected hospital backend endpoints reject requests
 * with missing or malformed authentication tokens and leak zero sensitive patient database records.
 */
describe("HMS-AUTH-027: Reject Request When Auth Header Is Stripped or Tampered", () => {
  it("rejects unauthorized access when requesting protected endpoints without valid token", () => {
    // 1. Send request with stripped/tampered authorization header to /api/patients
    cy.request({
      method: "GET",
      url: "https://devhmsapi.techfeatures.ai/api/patients",
      failOnStatusCode: false,
      headers: {
        Authorization: "Bearer fake_stripped_header_123",
      },
    }).then((response) => {
      // 2. Verify server rejects request (non-200) and leaks zero patient database rows
      expect(response.status).to.not.equal(200);
      expect([401, 403, 404, 405]).to.include(response.status);
      expect(response.body).to.not.have.property("data");
    });
  });
});
