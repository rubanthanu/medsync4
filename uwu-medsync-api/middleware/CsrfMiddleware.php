<?php
/**
 * CsrfMiddleware — CSRF token generation & validation.
 *
 * How it works:
 * 1. A CSRF token is generated once per session and stored in $_SESSION.
 * 2. The frontend fetches the token via GET /auth/csrf_token.
 * 3. Every state-changing request (POST/PUT/PATCH/DELETE) must include
 *    the token in the X-CSRF-Token header.
 * 4. The middleware validates the header against the session value.
 *
 * Uses hash_equals() to prevent timing attacks.
 */
class CsrfMiddleware {

    /**
     * Generate (or return existing) CSRF token for the current session.
     * Token is 64 hex characters (32 bytes of entropy).
     */
    public static function getToken() {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    /**
     * Validate the CSRF token sent in the request header.
     *
     * Must be called for every POST/PUT/PATCH/DELETE request.
     * Sends HTTP 403 and exits if validation fails.
     */
    public static function validate() {
        // Read from custom header (case-insensitive via getallheaders)
        $headers = array_change_key_case(getallheaders(), CASE_LOWER);
        $token = $headers['x-csrf-token'] ?? '';

        if (
            empty($_SESSION['csrf_token']) ||
            empty($token) ||
            !hash_equals($_SESSION['csrf_token'], $token)
        ) {
            http_response_code(403);
            echo json_encode(["message" => "CSRF token validation failed."]);
            exit();
        }
    }

    /**
     * Check whether CSRF validation should be enforced for this request.
     *
     * Returns true for POST, PUT, PATCH, DELETE methods — i.e. any
     * state-changing HTTP verb.
     */
    public static function shouldValidate() {
        $method = strtoupper($_SERVER['REQUEST_METHOD']);
        return in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true);
    }
}
?>
