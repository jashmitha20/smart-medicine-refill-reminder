package com.medicinerefill.smartmedicine.dto;

public class JwtAuthenticationResponse {
    
    private String accessToken;
    private String tokenType = "Bearer";
    private UserSummary user;
    
    public JwtAuthenticationResponse(String accessToken, UserSummary user) {
        this.accessToken = accessToken;
        this.user = user;
    }
    
    // Getters and setters
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public String getTokenType() {
        return tokenType;
    }
    
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
    
    public UserSummary getUser() {
        return user;
    }
    
    public void setUser(UserSummary user) {
        this.user = user;
    }
    
    public static class UserSummary {
        private Long id;
        private String name;
        private String email;
        
        public UserSummary(Long id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }
        
        // Getters and setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
    }
}