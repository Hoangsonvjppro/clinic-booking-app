package com.clinic.notificationservice.repository;

import com.clinic.notificationservice.entity.UserStatistics;
import com.clinic.notificationservice.enums.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserStatisticsRepository extends JpaRepository<UserStatistics, UUID> {

    // === Find by User ===
    
    Optional<UserStatistics> findByUserId(UUID userId);
    
    Optional<UserStatistics> findByUserIdAndUserType(UUID userId, UserType userType);
    
    boolean existsByUserId(UUID userId);

    // === Find by User Type ===
    
    Page<UserStatistics> findByUserType(UserType userType, Pageable pageable);
    
    List<UserStatistics> findByUserTypeOrderByAverageRatingDesc(UserType userType);

    // === Top Users Queries ===
    
    @Query("SELECT us FROM UserStatistics us WHERE us.userType = :userType " +
           "ORDER BY us.noShowCount DESC")
    Page<UserStatistics> findTopNoShowUsers(@Param("userType") UserType userType, Pageable pageable);
    
    @Query("SELECT us FROM UserStatistics us WHERE us.userType = :userType " +
           "ORDER BY us.warningCount DESC")
    Page<UserStatistics> findTopWarnedUsers(@Param("userType") UserType userType, Pageable pageable);
    
    @Query("SELECT us FROM UserStatistics us WHERE us.userType = :userType " +
           "ORDER BY us.averageRating DESC")
    Page<UserStatistics> findTopRatedUsers(@Param("userType") UserType userType, Pageable pageable);
    
    @Query("SELECT us FROM UserStatistics us WHERE us.userType = :userType " +
           "ORDER BY us.completedAppointments DESC")
    Page<UserStatistics> findMostActiveUsers(@Param("userType") UserType userType, Pageable pageable);

    // === Filter Queries ===
    
    @Query("SELECT us FROM UserStatistics us WHERE us.noShowCount >= :minNoShows")
    List<UserStatistics> findUsersWithHighNoShowCount(@Param("minNoShows") int minNoShows);
    
    @Query("SELECT us FROM UserStatistics us WHERE us.warningCount >= :minWarnings")
    List<UserStatistics> findUsersWithHighWarningCount(@Param("minWarnings") int minWarnings);

    // === Aggregate Statistics ===
    
    @Query("SELECT COUNT(us) FROM UserStatistics us WHERE us.userType = :userType")
    long countByUserType(@Param("userType") UserType userType);
    
    @Query("SELECT AVG(us.averageRating) FROM UserStatistics us WHERE us.userType = :userType")
    Double getAverageRatingByUserType(@Param("userType") UserType userType);
    
    @Query("SELECT SUM(us.totalAppointments) FROM UserStatistics us WHERE us.userType = :userType")
    Long getTotalAppointmentsByUserType(@Param("userType") UserType userType);
    
    @Query("SELECT SUM(us.noShowCount) FROM UserStatistics us WHERE us.userType = :userType")
    Long getTotalNoShowsByUserType(@Param("userType") UserType userType);
}
